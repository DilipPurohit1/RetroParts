import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IListing, ICompatibility } from '../types/index.js';

export interface ActiveVehicle {
  brand: string;
  model: string;
  year?: number | string;
  variant?: string;
}

export type FitmentLevel = 'exact' | 'partial' | 'incompatible' | 'unknown';

export interface FitmentResult {
  level: FitmentLevel;
  badgeLabel: string;
  badgeClass: string;
  description: string;
}

interface VehicleContextType {
  activeVehicle: ActiveVehicle | null;
  setActiveVehicle: (vehicle: ActiveVehicle | null) => void;
  clearActiveVehicle: () => void;
  checkFitment: (listing: IListing) => FitmentResult;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeVehicle, setActiveVehicleState] = useState<ActiveVehicle | null>(() => {
    try {
      const saved = localStorage.getItem('retroparts_active_vehicle');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setActiveVehicle = (vehicle: ActiveVehicle | null) => {
    setActiveVehicleState(vehicle);
    if (vehicle) {
      localStorage.setItem('retroparts_active_vehicle', JSON.stringify(vehicle));
    } else {
      localStorage.removeItem('retroparts_active_vehicle');
    }
  };

  const clearActiveVehicle = () => {
    setActiveVehicle(null);
  };

  const checkFitment = (listing: IListing): FitmentResult => {
    if (!activeVehicle || !activeVehicle.brand) {
      return {
        level: 'unknown',
        badgeLabel: 'Compatibility Unknown',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        description: 'Select your vehicle to evaluate fitment compatibility.',
      };
    }

    const { brand, model, year, variant } = activeVehicle;
    const targetYear = year ? Number(year) : null;

    // Check direct primary vehicle match
    const isBrandMatch = listing.vehicleBrand.toLowerCase() === brand.toLowerCase();
    const isModelMatch = listing.vehicleModel.toLowerCase().includes(model.toLowerCase()) ||
                         model.toLowerCase().includes(listing.vehicleModel.toLowerCase());

    // Check compatibleVehicles array
    const matchedCompat = listing.compatibleVehicles?.find((c: ICompatibility) => {
      const bMatch = c.brand.toLowerCase() === brand.toLowerCase();
      const mMatch = c.model.toLowerCase().includes(model.toLowerCase()) ||
                     model.toLowerCase().includes(c.model.toLowerCase());
      if (!bMatch || !mMatch) return false;
      if (targetYear && c.yearFrom && c.yearTo) {
        return targetYear >= c.yearFrom && targetYear <= c.yearTo;
      }
      return true;
    });

    if (matchedCompat || (isBrandMatch && isModelMatch)) {
      if (targetYear && listing.vehicleYear) {
        const listingYearNum = Number(listing.vehicleYear);
        if (!isNaN(listingYearNum) && listingYearNum === targetYear) {
          return {
            level: 'exact',
            badgeLabel: '✓ Exact Vehicle Match',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
            description: `Direct fitment confirmed for ${brand} ${model} (${targetYear}).`,
          };
        }
      }

      if (matchedCompat) {
        return {
          level: 'exact',
          badgeLabel: '✓ Exact Vehicle Match',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
          description: `Direct fitment mapped to ${matchedCompat.brand} ${matchedCompat.model} (${matchedCompat.yearFrom}-${matchedCompat.yearTo}).`,
        };
      }

      return {
        level: 'partial',
        badgeLabel: '⚠ Partial Fitment',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
        description: `Compatible with ${listing.vehicleBrand} ${listing.vehicleModel} family. Please check year/variant specs.`,
      };
    }

    return {
      level: 'incompatible',
      badgeLabel: '✕ Not Fitted For Selected Vehicle',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 font-semibold',
      description: `Engineered for ${listing.vehicleBrand} ${listing.vehicleModel}. May not fit your ${brand} ${model}.`,
    };
  };

  return (
    <VehicleContext.Provider
      value={{
        activeVehicle,
        setActiveVehicle,
        clearActiveVehicle,
        checkFitment,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
