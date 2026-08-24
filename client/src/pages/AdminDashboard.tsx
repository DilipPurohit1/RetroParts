import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { adminService } from '../services/adminService.js';
import { listingService } from '../services/listingService.js';
import { IListing } from '../types/index.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalUsers: 142,
    totalSellers: 34,
    totalListings: 89,
    totalOrders: 64,
    totalRevenue: 485000,
    openBounties: 12,
  });

  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'listings'>('overview');

  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, listingsData] = await Promise.all([
          adminService.getStats(),
          listingService.getListings({ limit: 50 }),
        ]);
        if (statsData) setStats(statsData);
        setListings(listingsData.data || []);
      } catch (err) {
        console.warn('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [isAuthenticated, user]);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await adminService.updateListingStatus(id, { featured: !current });
      setListings(
        listings.map((l) => (l._id === id ? { ...l, featured: !current } : l))
      );
      success(`Listing ${!current ? 'marked as Featured' : 'unmarked from Featured'}.`);
    } catch (err: any) {
      error('Failed to toggle featured status.');
    }
  };

  const CATEGORY_DISTRIBUTION = [
    { name: 'Engine Parts', count: 38, percent: '38%', color: 'bg-accent' },
    { name: 'Lighting & Gauges', count: 24, percent: '24%', color: 'bg-amber-500' },
    { name: 'Body & Chassis', count: 18, percent: '18%', color: 'bg-blue-500' },
    { name: 'Brakes & Hydraulics', count: 12, percent: '12%', color: 'bg-success' },
    { name: 'Exhaust & Intake', count: 8, percent: '8%', color: 'bg-purple-500' },
  ];

  const TOP_REQUESTED_VEHICLES = [
    { vehicle: 'Yamaha RX100 (1985-1996)', wantedCount: 28, avgBounty: '₹4,500' },
    { vehicle: 'Yamaha RD350 High Torque', wantedCount: 22, avgBounty: '₹14,000' },
    { vehicle: 'Maruti 800 SS80 (1983-1986)', wantedCount: 17, avgBounty: '₹3,200' },
    { vehicle: 'Royal Enfield Bullet 350 G2', wantedCount: 15, avgBounty: '₹6,800' },
    { vehicle: 'Honda City Type-Z VTEC', wantedCount: 11, avgBounty: '₹5,100' },
  ];

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-medium font-display text-text-primary">
                Admin governance control panel
              </h1>
              <Badge variant="copper">Root authority</Badge>
            </div>
            <p className="text-[13px] text-text-muted">
              Platform governance, listings moderation, Part Passport certifications, and marketplace analytics.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded text-[13px] font-medium transition-colors ${activeTab === 'overview' ? 'bg-accent text-white' : 'bg-surface-raised text-text-secondary border border-border hover:text-text-primary'}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded text-[13px] font-medium transition-colors ${activeTab === 'analytics' ? 'bg-accent text-white' : 'bg-surface-raised text-text-secondary border border-border hover:text-text-primary'}`}
            >
              Analytics & GMV
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className={`px-3.5 py-2 rounded text-[13px] font-medium transition-colors ${activeTab === 'listings' ? 'bg-accent text-white' : 'bg-surface-raised text-text-secondary border border-border hover:text-text-primary'}`}
            >
              Listings ({listings.length})
            </button>
          </div>
        </div>

        {/* Metrics Row (6 key statistics) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Total users</span>
            <p className="font-mono text-xl font-bold text-text-primary">{stats.totalUsers || 142}</p>
          </div>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Restorers</span>
            <p className="font-mono text-xl font-bold text-accent">{stats.totalSellers || 34}</p>
          </div>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Active spares</span>
            <p className="font-mono text-xl font-bold text-text-primary">{stats.totalListings || listings.length}</p>
          </div>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Escrow orders</span>
            <p className="font-mono text-xl font-bold text-text-primary">{stats.totalOrders || 64}</p>
          </div>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Total GMV</span>
            <p className="font-mono text-xl font-bold text-success">₹{(stats.totalRevenue || 485000).toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase text-text-muted">Open bounties</span>
            <p className="font-mono text-xl font-bold text-accent">{stats.openBounties || 12}</p>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution Bar Chart */}
            <div className="p-6 rounded-card bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[14px] text-text-primary flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent" /> Spares inventory by category
                </h3>
                <span className="text-[12px] font-mono text-text-muted">Total 100%</span>
              </div>

              <div className="space-y-3 pt-2">
                {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-text-primary">{cat.name}</span>
                      <span className="font-mono text-text-muted">{cat.count} listings ({cat.percent})</span>
                    </div>
                    <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden border border-border">
                      <div className={`h-full ${cat.color} transition-all duration-500`} style={{ width: cat.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Requested Vehicles */}
            <div className="p-6 rounded-card bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[14px] text-text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" /> Top wanted vehicle models
                </h3>
                <Badge variant="copper">High restorer demand</Badge>
              </div>

              <div className="divide-y divide-border pt-1">
                {TOP_REQUESTED_VEHICLES.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-[13px]">
                    <div>
                      <span className="font-medium text-text-primary block">{item.vehicle}</span>
                      <span className="text-[11px] text-text-muted">{item.wantedCount} active bounty requests</span>
                    </div>
                    <span className="font-mono text-accent">{item.avgBounty} avg budget</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Analytics & GMV */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-card bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-medium text-text-primary flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" /> GMV growth & platform escrow velocity
                  </h3>
                  <p className="text-[13px] text-text-muted">Monthly marketplace transaction volume in INR</p>
                </div>
                <Badge variant="success">+32% month-over-month</Badge>
              </div>

              {/* Monthly GMV Graph Representation */}
              <div className="grid grid-cols-6 gap-2 items-end h-44 pt-6 pb-2 px-2 bg-surface-raised rounded border border-border">
                {[
                  { month: 'Mar', gmv: '₹1.8L', height: '35%' },
                  { month: 'Apr', gmv: '₹2.4L', height: '48%' },
                  { month: 'May', gmv: '₹3.1L', height: '62%' },
                  { month: 'Jun', gmv: '₹3.9L', height: '78%' },
                  { month: 'Jul', gmv: '₹4.3L', height: '86%' },
                  { month: 'Aug', gmv: '₹4.85L', height: '96%' },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[11px] font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.gmv}
                    </span>
                    <div
                      className="w-full max-w-[40px] bg-gradient-to-t from-accent to-[#BA181B] rounded-t transition-all duration-500 group-hover:brightness-110"
                      style={{ height: bar.height }}
                    />
                    <span className="text-[11px] font-mono text-text-muted">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Listings Moderation Table */}
        {activeTab === 'listings' && (
          <div className="p-6 rounded-card bg-surface border border-border space-y-4">
            <h3 className="font-medium text-[14px] text-text-primary flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" /> Active marketplace listings moderation
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border text-text-muted font-mono uppercase text-[11px]">
                    <th className="pb-3 font-medium">Component / title</th>
                    <th className="pb-3 font-medium">Vehicle fitment</th>
                    <th className="pb-3 font-medium">Condition</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Quality</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {listings.map((l) => (
                    <tr key={l._id} className="hover:bg-surface-raised transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={l.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'}
                            alt={l.title}
                            className="w-10 h-10 rounded object-cover border border-border shrink-0 bg-base"
                          />
                          <div>
                            <span className="font-medium text-text-primary line-clamp-1">{l.title}</span>
                            <span className="text-[11px] font-mono text-accent">{l.oemNumber || 'No OEM #'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-text-secondary">
                        {l.vehicleBrand} {l.vehicleModel}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded bg-surface-raised border border-border text-text-secondary text-[11px]">
                          {l.condition}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-text-primary font-medium">
                        ₹{l.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 pr-4 font-mono">
                        <Badge variant="success">85/100</Badge>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(l._id, l.featured)}
                          className={`px-2.5 py-1 rounded text-[12px] font-medium transition-colors ${
                            l.featured
                              ? 'bg-accent text-white'
                              : 'bg-surface-raised text-text-secondary border border-border hover:text-text-primary'
                          }`}
                        >
                          {l.featured ? 'Featured ★' : 'Set featured'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};
