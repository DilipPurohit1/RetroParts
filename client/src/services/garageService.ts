import API from './api.js';

export interface IRestorationEntry {
  _id?: string;
  garageVehicleId: string;
  title: string;
  description: string;
  category: 'engine' | 'bodywork' | 'paint' | 'electrical' | 'brakes' | 'interior' | 'general';
  cost: number;
  date: string;
  odometerKm?: number;
  photos?: string[];
  createdAt?: string;
}

export interface IGarageVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  nickname?: string;
  registrationNumber?: string;
  vin?: string;
  currentOdometerKm?: number;
  status: 'in_restoration' | 'running' | 'project_build' | 'stored' | 'completed';
  coverPhoto?: string;
  photos?: string[];
  totalRestorationSpend: number;
  createdAt: string;
  updatedAt: string;
}

export const garageService = {
  getVehicles: async (): Promise<IGarageVehicle[]> => {
    const res = await API.get('/garage');
    return res.data.data || res.data.vehicles || [];
  },

  addVehicle: async (vehicleData: Partial<IGarageVehicle>): Promise<IGarageVehicle> => {
    const res = await API.post('/garage', vehicleData);
    return res.data.data || res.data.vehicle;
  },

  getVehicleDetail: async (id: string): Promise<{ vehicle: IGarageVehicle; entries: IRestorationEntry[] }> => {
    const res = await API.get(`/garage/${id}`);
    return res.data.data || { vehicle: res.data.vehicle, entries: res.data.entries };
  },

  updateVehicle: async (id: string, vehicleData: Partial<IGarageVehicle>): Promise<IGarageVehicle> => {
    const res = await API.patch(`/garage/${id}`, vehicleData);
    return res.data.data || res.data.vehicle;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await API.delete(`/garage/${id}`);
  },

  addEntry: async (vehicleId: string, entryData: Partial<IRestorationEntry>): Promise<IRestorationEntry> => {
    const res = await API.post(`/garage/${vehicleId}/entries`, entryData);
    return res.data.data || res.data.entry;
  },
};
