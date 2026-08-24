import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Plus,
  Wrench,
  Gauge,
  Search,
  PlusCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { garageService, IGarageVehicle, IRestorationEntry } from '../services/garageService.js';
import { useVehicle } from '../context/VehicleContext.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { Modal } from '../components/common/Modal.js';

export const Garage: React.FC = () => {
  const { setActiveVehicle } = useVehicle();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<IGarageVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<IGarageVehicle | null>(null);
  const [entries, setEntries] = useState<IRestorationEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 1985,
    variant: 'Standard',
    nickname: '',
    registrationNumber: '',
    vin: '',
    status: 'in_restoration' as const,
    currentOdometerKm: 0,
    coverPhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
  });

  // Add Log Entry Modal State
  const [showAddEntryModal, setShowAddEntryModal] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    category: 'engine' as const,
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    odometerKm: 0,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await garageService.getVehicles();
      setVehicles(data);
      if (data.length > 0) {
        loadVehicleDetail(data[0]._id);
      }
    } catch (err) {
      console.warn('Failed to load garage vehicles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVehicleDetail = async (id: string) => {
    try {
      const detail = await garageService.getVehicleDetail(id);
      setSelectedVehicle(detail.vehicle);
      setEntries(detail.entries || []);
    } catch (err) {
      console.error('Failed to load vehicle detail', err);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await garageService.addVehicle(newVehicle);
      setShowAddVehicleModal(false);
      await fetchVehicles();
      loadVehicleDetail(created._id);
    } catch (err) {
      console.error('Failed to add garage vehicle', err);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      await garageService.addEntry(selectedVehicle._id, newEntry);
      setShowAddEntryModal(false);
      loadVehicleDetail(selectedVehicle._id);
    } catch (err) {
      console.error('Failed to log restoration entry', err);
    }
  };

  const handleFindSpares = (veh: IGarageVehicle) => {
    setActiveVehicle({
      brand: veh.make,
      model: veh.model,
      year: veh.year,
      variant: veh.variant,
    });
    navigate(`/explore?brand=${encodeURIComponent(veh.make)}&model=${encodeURIComponent(veh.model)}&year=${veh.year}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono">Running</span>;
      case 'in_restoration':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 font-mono">In Restoration</span>;
      case 'project_build':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-mono">Project Build</span>;
      case 'stored':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#222222] text-[#888888] border border-[#2A2A2A] font-mono">Stored</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#222222] text-[#888888] font-mono">{status}</span>;
    }
  };

  const totalSpent = entries.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            PRIVATE ENTHUSIAST VAULT
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            My Garage & Build Log
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-sans">
            Manage your classic collection, record restoration milestones, and track maintenance investments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddVehicleModal(true)}
          className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> ADD VEHICLE
        </button>
      </div>

      {/* Vehicles Grid / Empty State */}
      {vehicles.length === 0 && !isLoading ? (
        <div className="p-12 text-center bg-[#161616] rounded border border-[#2A2A2A] space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded bg-[#222222] border border-[#2A2A2A] flex items-center justify-center mx-auto text-[#E10600]">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-display">Your Garage is Empty</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Add your vintage car or motorcycle to start logging parts, restoration milestones, and finding compatible spares.
          </p>
          <button
            type="button"
            onClick={() => setShowAddVehicleModal(true)}
            className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase rounded inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add First Ride
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Vehicle Selector Cards */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#888888]">
              MY VEHICLES ({vehicles.length})
            </h2>

            <div className="space-y-2.5">
              {vehicles.map((veh) => (
                <div
                  key={veh._id}
                  onClick={() => loadVehicleDetail(veh._id)}
                  className={`p-3.5 rounded border transition-colors cursor-pointer relative overflow-hidden ${
                    selectedVehicle?._id === veh._id
                      ? 'bg-[#222222] border-[#E10600]'
                      : 'bg-[#161616] border-[#2A2A2A] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={veh.coverPhoto || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'}
                      alt={veh.nickname || veh.model}
                      className="w-14 h-14 rounded object-cover border border-[#2A2A2A] shrink-0 bg-[#0D0D0D]"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {veh.nickname || `${veh.year} ${veh.make} ${veh.model}`}
                      </h4>
                      <p className="text-xs text-[#888888] truncate font-mono">
                        {veh.make} • {veh.model} ({veh.year})
                      </p>
                      <div className="pt-1">
                        {getStatusBadge(veh.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Main Area: Vehicle Detail & Restoration Timeline */}
          {selectedVehicle && (
            <div className="lg:col-span-8 space-y-6">
              {/* Vehicle Hero Card */}
              <div className="p-6 rounded bg-[#161616] border border-[#2A2A2A] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase">
                      {selectedVehicle.nickname || `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
                    </h2>
                    <p className="text-xs text-[#888888] font-mono mt-0.5">
                      {selectedVehicle.make} {selectedVehicle.model} • {selectedVehicle.variant} • Built {selectedVehicle.year}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFindSpares(selectedVehicle)}
                      className="bg-[#E10600] hover:bg-[#B20404] text-white px-4 py-2 text-xs font-bold uppercase rounded transition-colors flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" /> Find Compatible Spares
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddEntryModal(true)}
                      className="bg-[#222222] hover:bg-[#2A2A2A] text-white border border-[#2A2A2A] px-4 py-2 text-xs font-bold uppercase rounded transition-colors flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Log Milestone
                    </button>
                  </div>
                </div>

                {/* Quick Vehicle Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#2A2A2A] text-xs font-mono">
                  <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A]">
                    <span className="text-[10px] text-[#888888] uppercase block">Total Spent</span>
                    <span className="text-sm font-bold text-[#E10600]">{formatPrice(totalSpent)}</span>
                  </div>
                  <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A]">
                    <span className="text-[10px] text-[#888888] uppercase block">Logged Milestones</span>
                    <span className="text-sm font-bold text-white">{entries.length} entries</span>
                  </div>
                  <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A]">
                    <span className="text-[10px] text-[#888888] uppercase block">Odometer</span>
                    <span className="text-sm font-bold text-white">{selectedVehicle.currentOdometerKm || 0} km</span>
                  </div>
                  <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A]">
                    <span className="text-[10px] text-[#888888] uppercase block">Build Status</span>
                    <div className="mt-0.5">{getStatusBadge(selectedVehicle.status)}</div>
                  </div>
                </div>
              </div>

              {/* Build Log & Restoration Entries Timeline */}
              <div className="p-6 rounded bg-[#161616] border border-[#2A2A2A] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                    RESTORATION LOG & MILESTONES
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddEntryModal(true)}
                    className="text-xs text-[#E10600] hover:underline font-bold uppercase"
                  >
                    + Add Entry
                  </button>
                </div>

                {entries.length === 0 ? (
                  <p className="text-xs text-[#888888] py-6 text-center">
                    No restoration entries recorded yet. Click "+ Add Entry" to record parts replaced, engine rebuilds, or maintenance milestones.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry._id}
                        className="p-4 rounded bg-[#222222] border border-[#2A2A2A] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs uppercase font-display">{entry.title}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#161616] text-[#BAC0CD] border border-[#2A2A2A] font-mono">
                              {entry.category}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#E10600]">
                            {formatPrice(entry.cost)}
                          </span>
                        </div>
                        <p className="text-xs text-[#888888] leading-relaxed">{entry.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#888888] font-mono pt-1">
                          <span>Date: {formatDate(entry.date)}</span>
                          {Boolean(entry.odometerKm && entry.odometerKm > 0) && <span>Odometer: {entry.odometerKm} km</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        title="ADD VEHICLE TO GARAGE"
      >
        <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Yamaha / Premier / Maruti"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. RX100 / Padmini / 800 SS80"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Production Year *</label>
              <input
                type="number"
                required
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value, 10) || 1985 })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Nickname</label>
              <input
                type="text"
                placeholder="e.g. The Silver Bullet"
                value={newVehicle.nickname}
                onChange={(e) => setNewVehicle({ ...newVehicle, nickname: e.target.value })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Status</label>
            <select
              value={newVehicle.status}
              onChange={(e: any) => setNewVehicle({ ...newVehicle, status: e.target.value })}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
            >
              <option value="in_restoration">In Restoration</option>
              <option value="running">Road Legal & Running</option>
              <option value="project_build">Project Build</option>
              <option value="stored">Preserved in Storage</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddVehicleModal(false)}
              className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2 rounded text-xs font-bold uppercase"
            >
              Save Ride
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Log Entry Modal */}
      <Modal
        isOpen={showAddEntryModal}
        onClose={() => setShowAddEntryModal(false)}
        title="LOG RESTORATION MILESTONE"
      >
        <form onSubmit={handleCreateEntry} className="space-y-4 text-xs text-left">
          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Milestone Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Installed NOS Mikuni Carburetor & Tuned Jets"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Cost Incurred (₹) *</label>
              <input
                type="number"
                required
                value={newEntry.cost}
                onChange={(e) => setNewEntry({ ...newEntry, cost: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Category</label>
              <select
                value={newEntry.category}
                onChange={(e: any) => setNewEntry({ ...newEntry, category: e.target.value })}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="engine">Engine & Mechanical</option>
                <option value="body">Body & Paint</option>
                <option value="electrical">Electrical & Lighting</option>
                <option value="interior">Interior & Upholstery</option>
                <option value="suspension">Suspension & Brakes</option>
                <option value="general">General Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">Milestone Notes</label>
            <textarea
              rows={3}
              placeholder="Notes on torque specs, part provenance, replaced gaskets..."
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddEntryModal(false)}
              className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2 rounded text-xs font-bold uppercase"
            >
              Log Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
