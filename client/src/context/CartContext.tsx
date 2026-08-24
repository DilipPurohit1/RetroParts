import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IListing } from '../types/index.js';
import { useToast } from './ToastContext.js';

export interface CartItem {
  listingId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName?: string;
  oemNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  condition?: string;
  maxQuantity: number;
  listing?: IListing;
}

export interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (listing: IListing, quantity?: number) => void;
  removeFromCart: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  shippingTotal: number;
  protectionFee: number;
  totalAmount: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('retroparts_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const { success, warning } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('retroparts_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (listing: IListing, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.listingId === listing._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, listing.quantity || 10);
        success(`Updated ${listing.title} quantity to ${newQty}.`, 'Cart Updated');
        return prev.map((item) =>
          item.listingId === listing._id ? { ...item, quantity: newQty } : item
        );
      } else {
        const sellerId =
          typeof listing.seller === 'object'
            ? listing.seller._id || listing.seller.id
            : listing.seller;
        const sellerName =
          typeof listing.seller === 'object' ? listing.seller.name : 'Verified Restorer';

        const newItem: CartItem = {
          listingId: listing._id,
          title: listing.title,
          price: listing.price,
          quantity: Math.min(quantity, listing.quantity || 1),
          image: listing.images[0] || '',
          sellerId: sellerId || '',
          sellerName,
          oemNumber: listing.oemNumber,
          vehicleBrand: listing.vehicleBrand,
          vehicleModel: listing.vehicleModel,
          condition: listing.condition,
          maxQuantity: listing.quantity || 5,
          listing,
        };
        success(`"${listing.title}" added to your Escrow Cart!`, 'Added to Cart');
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart((prev) => prev.filter((item) => item.listingId !== listingId));
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.listingId === listingId) {
          const clampedQty = Math.min(quantity, item.maxQuantity);
          if (clampedQty < quantity) {
            warning(`Only ${item.maxQuantity} units available in stock.`, 'Stock Limit');
          }
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('retroparts_cart');
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? (subtotal > 15000 ? 0 : 350) : 0;
  const protectionFee = cart.length > 0 ? 0 : 0;
  const totalAmount = subtotal + shippingFee + protectionFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartCount: itemCount,
        subtotal,
        shippingFee,
        shippingTotal: shippingFee,
        protectionFee,
        totalAmount,
        total: totalAmount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
