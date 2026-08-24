export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'admin' | 'both';
  sellerType?: 'individual' | 'collector' | 'mechanic' | 'garage' | 'supplier';
  avatar?: string;
  bio?: string;
  location?: {
    city: string;
    state: string;
    pincode: string;
  };
  isVerifiedSeller?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  sellerRating?: number;
  sellerReviewCount?: number;
  savedVehicles?: Array<{
    brand: string;
    model: string;
    year?: number | string;
    variant?: string;
  }>;
  createdAt?: string;
}


export interface ICompatibility {
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  variant?: string;
}

export interface IListing {
  _id: string;
  title: string;
  description: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
    icon: string;
  } | string;
  categoryName: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number | string;
  vehicleVariant?: string;
  compatibleVehicles: ICompatibility[];
  oemNumber: string;
  condition: 'NOS (New Old Stock)' | 'OEM Mint' | 'OEM Refurbished' | 'Used - Grade A' | 'Used - Restorable';
  partType: 'OEM Original' | 'Period Aftermarket' | 'Reproduction / Restomod';
  price: number;
  originalPrice?: number;
  quantity: number;
  negotiable: boolean;
  location: {
    city: string;
    state: string;
    pincode?: string;
  };
  images: string[];
  seller: IUser;
  passportId?: string;
  verificationStatus?: 'unverified' | 'claimed' | 'pending' | 'reviewed' | 'verified' | 'rejected';
  listingQualityScore?: number;
  status: 'active' | 'sold' | 'paused' | 'under_review' | 'rejected';
  views: number;
  featured: boolean;
  rarity: 'Common Vintage' | 'Rare Find' | 'Collector Grade' | 'Discontinued OEM' | 'Extremely Rare / Holy Grail';
  shippingAvailable: boolean;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;

}

export interface IVehicle {
  _id: string;
  brand: string;
  model: string;
  type: 'car' | 'bike';
  yearFrom: number;
  yearTo: number;
  variants: string[];
  popular: boolean;
  imageUrl?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  partCount: number;
  featured: boolean;
}

export interface IWantedOffer {
  _id?: string;
  seller: IUser;
  listingId?: IListing;
  offerPrice: number;
  message: string;
  contactNumber?: string;
  createdAt: string;
}

export interface IWantedPart {
  _id: string;
  title: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number | string;
  vehicleVariant?: string;
  category: string;
  description: string;
  targetBudget: number;
  urgency: 'urgent' | 'moderate' | 'flexible';
  conditionRequired: 'Any Condition' | 'NOS Only' | 'Good Used' | 'Restorable';
  location?: {
    city: string;
    state: string;
  };
  referenceImages?: string[];
  requester?: IUser;
  user?: IUser;
  status: 'searching' | 'matches_found' | 'seller_contacted' | 'fulfilled' | 'closed';
  offers: IWantedOffer[];
  offersCount?: number;
  matchingListings?: IListing[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  listing: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  seller: IUser;
  oemNumber?: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  buyer: IUser;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'credit_card' | 'upi' | 'escrow_delivery' | 'mock_card';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  orderStatus: 'placed' | 'verified' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingCourier?: string;
  subtotal: number;
  shippingFee: number;
  protectionFee: number;
  totalAmount: number;
  statusHistory: Array<{
    status: string;
    note: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  listing?: IListing;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: Record<string, number>;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  conversation: string;
  sender: IUser;
  recipient: string;
  text: string;
  listingReference?: IListing;
  read: boolean;
  createdAt: string;
}

export interface IReview {
  _id: string;
  seller: string;
  buyer: IUser;
  order?: string;
  listing?: {
    _id: string;
    title: string;
  };
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface INotification {
  _id: string;
  user: string;
  type: 'wanted_match' | 'order_update' | 'new_message' | 'listing_approved' | 'seller_verified' | 'price_drop' | 'new_offer';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}
