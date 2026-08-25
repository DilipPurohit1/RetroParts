import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  Car,
  Bookmark,
  Layers,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { HeritageLogo } from './HeritageLogo.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const [searchInput, setSearchInput] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const categoriesList = [
    { name: 'Engine Parts', slug: 'Engine Parts' },
    { name: 'Braking System', slug: 'Braking System' },
    { name: 'Suspension', slug: 'Suspension' },
    { name: 'Electrical & Ignition', slug: 'Electrical & Ignition' },
    { name: 'Body & Chassis', slug: 'Body & Chassis' },
    { name: 'Exhaust & Intake', slug: 'Exhaust & Intake' },
    { name: 'Transmission', slug: 'Transmission' },
    { name: 'Fuel System', slug: 'Fuel System' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0D0D0D] border-b border-[#2A2A2A]">
      {/* Top Header Tier */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <HeritageLogo size="md" />
          </Link>

          {/* Center: Search Bar with Red Embedded Button */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center relative"
          >
            <input
              type="text"
              placeholder="Search for parts, brands, categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#161616] text-[#E5E5E5] placeholder-[#888888] text-xs sm:text-sm rounded border border-[#2A2A2A] hover:border-[#383838] focus:border-[#E10600] pl-4 pr-12 py-2 outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#E10600] hover:bg-[#B20404] text-white p-1.5 rounded transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right: Utilities (Wishlist, Cart, Account) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 text-xs text-[#E5E5E5] hover:text-[#E10600] transition-colors"
            >
              <div className="relative">
                <Heart className="w-4 h-4 text-[#E5E5E5]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E10600] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-medium">Wishlist</span>
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#E5E5E5] hover:text-[#E10600] transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#E5E5E5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E10600] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-medium">Cart</span>
            </button>

            {/* Account / User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs text-[#E5E5E5] hover:text-[#E10600] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#222222] border border-[#2A2A2A] text-white text-[10px] flex items-center justify-center font-bold">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                    {user?.name ? user.name.split(' ')[0] : 'My Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#888888]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#161616] border border-[#2A2A2A] rounded shadow-2xl py-1 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-[#2A2A2A]">
                      <p className="font-bold text-[#E5E5E5] truncate">{user?.name}</p>
                      <p className="text-[10px] text-[#888888] font-mono capitalize">{user?.role} Account</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-[#E5E5E5] hover:bg-[#222222] hover:text-[#E10600]"
                    >
                      Buyer Dashboard
                    </Link>

                    {(user?.role === 'seller' || user?.role === 'admin' || user?.role === 'both') && (
                      <Link
                        to="/dashboard/seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-[#E5E5E5] hover:bg-[#222222] hover:text-[#E10600]"
                      >
                        Seller Console
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/dashboard/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-[#E5E5E5] hover:bg-[#222222] hover:text-[#E10600]"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-[#E5E5E5] hover:bg-[#222222] hover:text-[#E10600]"
                    >
                      Profile Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-danger hover:bg-[#222222] flex items-center gap-1.5 border-t border-[#2A2A2A]"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-xs text-[#E5E5E5] hover:text-[#E10600] font-medium transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">My Account</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#E5E5E5] hover:text-[#E10600] p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navbar Tier (Secondary Row matching reference) */}
      <div className="hidden md:block bg-[#161616] border-t border-[#2A2A2A]">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-11 text-xs font-bold uppercase tracking-wider">
            {/* HOME Tab (Solid Red Active State) */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              HOME
            </NavLink>

            {/* SHOP / EXPLORE */}
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              SHOP
            </NavLink>

            {/* CATEGORIES DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="px-3.5 py-1.5 rounded text-[#E5E5E5] hover:text-white hover:bg-[#222222] flex items-center gap-1 transition-colors"
              >
                <span>CATEGORIES</span>
                <ChevronDown className="w-3 h-3 text-[#888888]" />
              </button>

              {categoryDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-1 w-52 bg-[#161616] border border-[#2A2A2A] rounded shadow-2xl py-1 z-50 text-xs normal-case font-normal animate-fade-in"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/explore?category=${encodeURIComponent(cat.slug)}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block px-4 py-2 text-[#E5E5E5] hover:bg-[#222222] hover:text-[#E10600] font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SOURCING REQUESTS */}
            <NavLink
              to="/wanted"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              SOURCING REQUESTS
            </NavLink>

            {/* GARAGE */}
            <NavLink
              to="/garage"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              GARAGE
            </NavLink>

            {/* SELL A PART */}
            <NavLink
              to="/sell"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              SELL PART
            </NavLink>

            {/* ABOUT & FAQ */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              ABOUT & FAQ
            </NavLink>

            {/* CONTACT */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#E5E5E5] hover:text-white hover:bg-[#222222]'
                }`
              }
            >
              CONTACT
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161616] border-b border-[#2A2A2A] px-4 py-4 space-y-3 animate-fade-in text-xs font-bold uppercase tracking-wider">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search parts, vehicles, OEM..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#222222] text-white text-xs rounded pl-3 pr-10 py-2.5 outline-none border border-[#2A2A2A]"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#E10600] text-white p-1.5 rounded">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            Home
          </Link>
          <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            Shop All Spares
          </Link>
          <Link to="/wanted" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            Rare Part Sourcing
          </Link>
          <Link to="/garage" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            My Vehicles
          </Link>
          <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            List a Part
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            About Us & FAQ
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#E5E5E5] hover:text-[#E10600]">
            Contact Concierge
          </Link>

          {/* Mobile User Profile & 1-Tap Sign Out */}
          <div className="pt-3 border-t border-[#2A2A2A] space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2 bg-[#202020] p-3 rounded border border-[#2E2E2E]">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-white text-xs truncate">{user?.name}</p>
                    <p className="text-[10px] text-[#888888] font-mono truncate">{user?.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#E10600]/20 text-[#E10600] text-[9px] font-mono font-bold uppercase shrink-0">
                    {user?.role || 'Buyer'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-1.5 rounded bg-[#2A2A2A] text-white text-[11px] font-bold hover:bg-[#333333]"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#E10600] text-white text-[11px] font-bold hover:bg-[#B20404]"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded bg-[#222222] border border-[#333333] text-white text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded bg-[#E10600] text-white text-xs font-bold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
