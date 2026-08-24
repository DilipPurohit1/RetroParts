import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  listing: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image: string;
  seller: mongoose.Types.ObjectId;
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

export interface IOrder extends Document {
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
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
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    oemNumber: { type: String },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'upi', 'escrow_delivery', 'mock_card'],
      default: 'mock_card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'completed',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'verified', 'dispatched', 'in_transit', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
    trackingNumber: { type: String, default: '' },
    trackingCourier: { type: String, default: 'Vintage Express Logistics' },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    protectionFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
