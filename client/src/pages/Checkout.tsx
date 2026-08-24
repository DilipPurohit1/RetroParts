import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { orderService } from '../services/orderService.js';
import { formatPrice } from '../utils/formatters.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';

export const Checkout: React.FC = () => {
  const { cart, subtotal, shippingTotal, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>(user?.name || 'Kavita Sharma');
  const [phone, setPhone] = useState<string>(user?.phone || '+91 97690 99881');
  const [addressLine, setAddressLine] = useState<string>('Flat 402, Sea Breeze Apts, Bandra West');
  const [city, setCity] = useState<string>(user?.location?.city || 'Mumbai');
  const [state, setState] = useState<string>(user?.location?.state || 'Maharashtra');
  const [pincode, setPincode] = useState<string>('400050');

  const [paymentMethod, setPaymentMethod] = useState<'mock_card' | 'upi' | 'escrow_delivery'>('mock_card');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8901');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCVV, setCardCVV] = useState<string>('412');
  const [upiId, setUpiId] = useState<string>('kavita@okaxis');

  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 text-text-primary">
        <h2 className="text-xl font-display font-medium text-text-primary">No items to checkout</h2>
        <p className="text-[13px] text-text-muted">Your cart is empty. Please select parts to continue.</p>
        <Link to="/explore">
          <Button variant="primary" size="md">
            Browse parts catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        items: cart.map((item: CartItem) => ({
          listingId: item.listingId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          seller: item.sellerId || (typeof item.listing?.seller === 'object' ? item.listing.seller._id : item.listing?.seller),
        })),
        shippingAddress: {
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
        },
        paymentMethod,
      };

      const newOrder = await orderService.createOrder(orderData);
      setCompletedOrder(newOrder);
      clearCart();
      success('Your order has been placed & payment securely held in Escrow!', 'Order confirmed');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to place order.', 'Error');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Order Complete Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 min-h-[80vh] flex flex-col justify-center text-text-primary">
        <div className="w-16 h-16 rounded-card bg-surface text-verified border border-verified/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[12px] font-medium text-verified bg-verified/15 px-3 py-1 rounded border border-verified/30">
            Escrow payment secured
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-text-primary pt-2">
            Order #{completedOrder.orderNumber} confirmed
          </h1>
          <p className="text-[13px] text-text-muted max-w-md mx-auto">
            Your funds are safely held in the RetroParts Escrow Vault. The verified restorer has been notified to inspect packaging and dispatch via specialized freight.
          </p>
        </div>

        <div className="p-6 rounded-card bg-surface border border-border text-left space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3 text-[13px]">
            <span className="text-text-muted">Shipping to:</span>
            <span className="font-medium text-text-primary">{fullName} ({city}, {state})</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3 text-[13px]">
            <span className="text-text-muted">Total amount:</span>
            <span className="font-mono font-medium text-text-primary text-base">{formatPrice(completedOrder.totalAmount || total)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted">Tracking code:</span>
            <span className="font-mono font-medium text-accent">{completedOrder.trackingNumber || 'TRK-RP-PENDING'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="md">
              View order in dashboard
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="secondary" size="md">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Checkout Steps Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            SECURE RESTORATION CHECKOUT
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            Escrow Protected Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-[12px] font-medium">
          <span className={`px-3 py-1 rounded border transition-colors ${step === 1 ? 'bg-accent text-white border-accent' : 'bg-surface text-text-secondary border-border'}`}>
            1. Shipping
          </span>
          <span className="text-text-muted">→</span>
          <span className={`px-3 py-1 rounded border transition-colors ${step === 2 ? 'bg-accent text-white border-accent' : 'bg-surface text-text-secondary border-border'}`}>
            2. Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="font-display font-medium text-lg text-text-primary">
                  Step 1: Delivery address & recipient
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Phone number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Street address / Flat / Workshop details *"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="State *"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <Input
                  label="Postal PIN code *"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to payment selection
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-medium text-lg text-text-primary">
                    Step 2: Escrow payment method
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[13px] font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  ← Edit address
                </button>
              </div>

              {/* Payment Option Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mock_card')}
                  className={`p-4 rounded border text-left transition-colors ${
                    paymentMethod === 'mock_card'
                      ? 'bg-accent-muted border-accent text-accent'
                      : 'bg-surface-raised border-border hover:bg-surface text-text-secondary'
                  }`}
                >
                  <span className="font-medium text-[13px] text-text-primary block">Credit / debit card</span>
                  <span className="text-[11px] text-text-muted">Escrow instant vaulting</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded border text-left transition-colors ${
                    paymentMethod === 'upi'
                      ? 'bg-accent-muted border-accent text-accent'
                      : 'bg-surface-raised border-border hover:bg-surface text-text-secondary'
                  }`}
                >
                  <span className="font-medium text-[13px] text-text-primary block">UPI / instant QR</span>
                  <span className="text-[11px] text-text-muted">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('escrow_delivery')}
                  className={`p-4 rounded border text-left transition-colors ${
                    paymentMethod === 'escrow_delivery'
                      ? 'bg-accent-muted border-accent text-accent'
                      : 'bg-surface-raised border-border hover:bg-surface text-text-secondary'
                  }`}
                >
                  <span className="font-medium text-[13px] text-text-primary block">Cash on delivery</span>
                  <span className="text-[11px] text-text-muted">Pay upon freight arrival</span>
                </button>
              </div>

              {paymentMethod === 'mock_card' && (
                <div className="p-4 rounded bg-surface-raised border border-border space-y-3">
                  <Input
                    label="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="CVV"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 rounded bg-surface-raised border border-border space-y-3">
                  <Input
                    label="Virtual payment address (UPI ID)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okbank"
                  />
                </div>
              )}

              <div className="p-4 rounded bg-surface-raised border border-border flex items-center gap-3 text-[13px] text-text-secondary">
                <ShieldCheck className="w-5 h-5 text-verified shrink-0" />
                <span>
                  <strong className="text-text-primary">Escrow security promise:</strong> Funds are not released to the seller until you confirm delivery and fitment inspection within 48 hours.
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <Button type="button" variant="secondary" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  isLoading={placingOrder}
                >
                  Confirm & vault payment ({formatPrice(total)})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-card p-6 space-y-5 sticky top-24">
          <h3 className="font-display font-medium text-lg text-text-primary border-b border-border pb-3">
            Items in order ({cart.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item: CartItem) => (
              <div key={item.listingId} className="flex items-center gap-3 text-[13px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover border border-border shrink-0 bg-base"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{item.title}</p>
                  <p className="text-text-muted text-[11px] font-mono">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-border text-[13px] text-text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-text-primary">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-mono font-medium text-text-primary">
                {shippingTotal === 0 ? 'FREE' : formatPrice(shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-base font-medium text-text-primary">
              <span>Total pay</span>
              <span className="font-mono text-xl font-bold text-text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
