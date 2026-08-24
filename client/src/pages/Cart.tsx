import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext.js';
import { formatPrice } from '../utils/formatters.js';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shippingTotal, total, itemCount } =
    useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-4 min-h-[75vh] flex flex-col justify-center text-[#E5E5E5] bg-[#0D0D0D]">
        <div className="w-14 h-14 rounded bg-[#161616] border border-[#2A2A2A] text-[#888888] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-display font-bold uppercase text-white">Your cart is empty</h2>
        <p className="text-xs text-[#888888] max-w-sm mx-auto">
          Explore our marketplace to find rare, vintage, and New Old Stock (NOS) spare parts for your classic ride.
        </p>
        <div className="pt-2">
          <Link to="/explore">
            <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase rounded transition-colors inline-flex items-center gap-2">
              Explore Parts Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 min-h-screen text-[#E5E5E5] bg-[#0D0D0D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4 text-left">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider">
            ESCROW SECURED CART
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'part' : 'parts'})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-[#888888] hover:text-[#E10600] transition-colors self-start sm:self-auto font-bold uppercase"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-3.5">
          {cart.map((item: CartItem) => (
            <div
              key={item.listingId}
              className="p-4 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-20 h-20 rounded object-cover border border-[#2A2A2A] shrink-0 bg-[#0D0D0D]"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#222222] text-[#BAC0CD] border border-[#2A2A2A] uppercase">
                    {item.vehicleBrand || 'Classic'} {item.vehicleModel || ''}
                  </span>
                  <Link to={`/parts/${item.listingId}`}>
                    <h3 className="font-bold text-sm text-white hover:text-[#E10600] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-mono font-bold text-white">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2A2A2A]">
                <div className="flex items-center border border-[#2A2A2A] rounded overflow-hidden bg-[#222222]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                    className="px-2.5 py-1 text-xs text-[#BAC0CD] hover:bg-[#161616] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                    className="px-2.5 py-1 text-xs text-[#BAC0CD] hover:bg-[#161616] transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="font-mono text-sm font-bold text-[#E10600] w-24 text-right">
                  {formatPrice(item.price * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.listingId)}
                  className="p-1.5 rounded text-[#888888] hover:text-[#E10600] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#2A2A2A] rounded p-6 space-y-5 sticky top-28">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-3">
            ORDER SUMMARY
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-[#888888]">
              <span>Subtotal ({itemCount} items)</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#888888]">
              <span>Standard Shipping</span>
              <span className="text-white">{formatPrice(shippingTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-[#2A2A2A] pt-3">
              <span className="text-white font-sans uppercase">Total Amount</span>
              <span className="text-[#E10600]">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm text-center block"
          >
            PROCEED TO CHECKOUT
          </button>

          <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A] flex items-start gap-2.5 text-[11px] text-[#BAC0CD]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <p>
              Vault Escrow Protection. Funds released to seller only after 48-hour inspection window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
