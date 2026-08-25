import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatPrice } from '../../utils/formatters.js';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    removeFromCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();
  const navigate = useNavigate();

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const drawerContent = (
    <div
      className="fixed inset-0 !z-[999999] overflow-hidden select-none animate-fade-in text-[#E5E5E5]"
      style={{ zIndex: 999999 }}
    >
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-[420px] bg-[#161616] border-l border-[#2A2A2A] shadow-2xl flex flex-col justify-between h-full">
          {/* Top Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E10600]" />
              <h2 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-white">
                YOUR CART ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#222222] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-[#888888]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white">Your cart is currently empty</p>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#E10600] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.listingId}
                  className="p-3 rounded-lg bg-[#202020] border border-[#2A2A2A] flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded bg-[#161616] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-[#888888]" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-6 space-y-1 text-left">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#E10600]">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#888888]">
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.listingId)}
                    className="absolute top-2.5 right-2.5 text-[#888888] hover:text-[#E10600] p-1 transition-colors"
                    title="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer: Order Summary + Action Buttons */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#2A2A2A] bg-[#141414] space-y-4">
              {/* Calculations */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#888888]">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>Shipping</span>
                  <span className="text-white font-bold">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-[#2A2A2A] pt-2">
                  <span className="text-white font-sans uppercase">Total</span>
                  <span className="text-[#E10600] text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm text-center block"
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full bg-[#222222] hover:bg-[#2A2A2A] text-[#E5E5E5] border border-[#2A2A2A] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center block"
                >
                  VIEW FULL CART
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : drawerContent;
};
