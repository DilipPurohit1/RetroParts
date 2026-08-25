import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  HelpCircle,
  Car,
  Settings,
  ShieldCheck,
  Truck,
  ChevronRight,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { orderService } from '../services/orderService.js';
import { wantedService } from '../services/wantedService.js';
import { IOrder, IWantedPart } from '../types/index.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { ProductCard } from '../components/marketplace/ProductCard.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';

export const UserDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [myBounties, setMyBounties] = useState<IWantedPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [ordersData, bountiesData] = await Promise.all([
          orderService.getMyOrders(),
          wantedService.getWantedParts({ userOnly: true }),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : (ordersData as any)?.data || []);
        setMyBounties(bountiesData.data || []);
      } catch (err) {
        console.warn('Dashboard data load error', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [isAuthenticated, activeTab]);

  const tabs = [
    { id: 'orders', label: 'My orders', icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
    { id: 'garage', label: 'My vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'bounties', label: 'Rare part requests', icon: <HelpCircle className="w-4 h-4" />, count: myBounties.length },
    { id: 'wishlist', label: 'Saved wishlist', icon: <Heart className="w-4 h-4" />, count: wishlist.length },
    { id: 'profile', label: 'Profile & addresses', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* User Header Profile Card */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded bg-surface-raised border border-border text-text-primary font-mono text-xl flex items-center justify-center font-bold">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-medium text-text-primary">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-surface-raised text-text-muted border border-border">
                {user?.role}
              </span>
            </div>
            <p className="text-[12px] text-text-muted mt-0.5">{user?.email} • {user?.phone || '+91 97690 99881'}</p>
            <p className="text-[13px] text-text-secondary mt-1">{user?.bio || 'Classic vehicle enthusiast & restorer'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/explore">
            <Button variant="primary" size="sm" rightIcon={<ShoppingBag className="w-4 h-4" />}>
              Browse catalog
            </Button>
          </Link>
          <Link to="/wanted">
            <Button variant="secondary" size="sm" leftIcon={<HelpCircle className="w-4 h-4 text-accent" />}>
              Part Sourcing
            </Button>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#200A0A] hover:bg-[#E10600] text-[#E10600] hover:text-white border border-[#E10600]/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`px-4 py-2 rounded text-[13px] font-medium transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-raised hover:text-text-primary border border-border'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono ${activeTab === tab.id ? 'bg-accent-dark text-white' : 'bg-surface-raised text-text-muted'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: My Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-card bg-surface border border-border space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="font-mono text-[13px] font-medium text-text-primary">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[12px] text-text-muted font-mono ml-2">
                      Placed on {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-verified/15 text-verified border border-verified/30">
                      {order.orderStatus.toUpperCase()}
                    </span>
                    <span className="font-mono text-base font-bold text-text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded bg-surface-raised border border-border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded object-cover border border-border shrink-0 bg-base"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-[13px] text-text-primary truncate">{item.title}</p>
                        <p className="text-[11px] font-mono text-text-muted">
                          Qty: {item.quantity} • {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Escrow Guarantee Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[12px] text-text-muted">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-accent" />
                    <span>
                      Courier: <strong className="text-text-secondary">{order.trackingCourier || 'Vintage Express Logistics'}</strong> (Code: <code className="font-mono text-accent">{order.trackingNumber || 'TRK-RP-98214401'}</code>)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-verified font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Escrow vault active (48h inspection guaranteed)</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-surface border border-border rounded-card space-y-3">
              <ShoppingBag className="w-8 h-8 text-text-muted mx-auto" />
              <h3 className="font-medium text-base text-text-primary">No orders placed yet</h3>
              <p className="text-[13px] text-text-muted">Find authentic vintage parts and checkout with Escrow protection.</p>
              <Link to="/explore">
                <Button variant="primary" size="sm">Browse spares catalog</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Vehicles (Garage) */}
      {activeTab === 'garage' && (
        <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display font-medium text-lg text-text-primary">My classic garage</h3>
              <p className="text-[13px] text-text-muted">Saved vehicles for 1-click fitment filtering</p>
            </div>
            <Link to="/garage">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Manage garage
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded bg-surface-raised border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface text-accent border border-border flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[14px] text-text-primary">1998 Honda City Type-Z</h4>
                  <p className="text-[12px] text-text-muted font-mono">Variant: 1.5 EXi Petrol</p>
                </div>
              </div>
              <Link to="/explore?brand=Honda&model=City+Type-Z">
                <Button variant="secondary" size="sm">Find parts</Button>
              </Link>
            </div>

            <div className="p-5 rounded bg-surface-raised border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface text-accent border border-border flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[14px] text-text-primary">1989 Yamaha RX100</h4>
                  <p className="text-[12px] text-text-muted font-mono">Variant: 98cc 2-Stroke</p>
                </div>
              </div>
              <Link to="/explore?brand=Yamaha&model=RX100">
                <Button variant="secondary" size="sm">Find parts</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Rare Part Requests (Bounties) */}
      {activeTab === 'bounties' && (
        <div className="space-y-4 animate-fade-in">
          {myBounties.length > 0 ? (
            myBounties.map((bounty) => (
              <div key={bounty._id} className="p-6 rounded-card bg-surface border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[12px] font-medium px-2 py-0.5 rounded bg-surface-raised text-text-primary border border-border">
                      {bounty.vehicleBrand} {bounty.vehicleModel} ({bounty.vehicleYear})
                    </span>
                    <Link to={`/wanted/${bounty._id}`}>
                      <h4 className="font-medium text-base text-text-primary hover:text-accent transition-colors mt-1">
                        {bounty.title}
                      </h4>
                    </Link>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-text-primary text-base">
                      {formatPrice(bounty.targetBudget)}
                    </span>
                    <span className="text-[11px] text-success bg-success/15 px-2 py-0.5 rounded border border-success/30 block mt-1">
                      {bounty.offers?.length || 0} seller quotes
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-text-secondary line-clamp-2">{bounty.description}</p>
                <div className="pt-2 border-t border-border flex justify-end">
                  <Link to={`/wanted/${bounty._id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                      View seller offers ({bounty.offers?.length || 0})
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-surface border border-border rounded-card space-y-3">
              <HelpCircle className="w-8 h-8 text-text-muted mx-auto" />
              <h3 className="font-medium text-base text-text-primary">No rare part bounties active</h3>
              <p className="text-[13px] text-text-muted">Post a request to have our specialist restorer network source hard-to-find spares.</p>
              <Link to="/wanted">
                <Button variant="primary" size="sm">Post a rare part bounty</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="animate-fade-in">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <ProductCard key={item._id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface border border-border rounded-card space-y-3">
              <Heart className="w-8 h-8 text-text-muted mx-auto" />
              <h3 className="font-medium text-base text-text-primary">Your wishlist is empty</h3>
              <p className="text-[13px] text-text-muted">Click the heart icon on any spare to save it for later comparison.</p>
              <Link to="/explore">
                <Button variant="primary" size="sm">Explore parts catalog</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Profile & Addresses */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6 animate-fade-in max-w-2xl">
          <h3 className="font-display font-medium text-lg text-text-primary border-b border-border pb-3">
            Account profile & delivery address
          </h3>
          <div className="space-y-4">
            <Input label="Full name" value={user?.name || ''} readOnly />
            <Input label="Email address" value={user?.email || ''} readOnly />
            <Input label="Phone number" value={user?.phone || '+91 97690 99881'} readOnly />
            <Input label="Primary delivery address" value="Flat 402, Sea Breeze Apts, Bandra West, Mumbai, MH - 400050" readOnly />
          </div>
        </div>
      )}
    </div>
  );
};
