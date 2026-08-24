import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';

export const MobileBottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const navItems = [
    { label: 'Home', path: '/', icon: Home, badge: 0 },
    { label: 'Shop', path: '/explore', icon: ShoppingBag, badge: 0 },
    { label: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: itemCount },
    { label: 'Account', path: isAuthenticated ? '/dashboard' : '/login', icon: User, badge: 0 },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D] border-t border-[#2A2A2A]"
    >
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
                  isActive
                    ? 'text-[#E10600]'
                    : 'text-[#888888] hover:text-[#E5E5E5]'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#E10600] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
