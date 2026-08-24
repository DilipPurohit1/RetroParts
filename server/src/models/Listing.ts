import mongoose, { Document, Schema } from 'mongoose';

export interface ICompatibility {
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  variant?: string;
}

export interface IListing extends Document {
  title: string;
  slug?: string;
  description: string;
  category: mongoose.Types.ObjectId;
  categoryName: string;
  subcategory?: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number | string;
  vehicleVariant?: string;
  compatibleVehicles: ICompatibility[];
  oemNumber: string;
  condition: 'NOS (New Old Stock)' | 'OEM Mint' | 'OEM Refurbished' | 'Used - Grade A' | 'Used - Restorable';
  partType: 'OEM Original' | 'Period Aftermarket' | 'Reproduction / Restomod';
  listingType?: 'buy_now' | 'auction' | 'negotiable';
  price: number;
  originalPrice?: number;
  quantity: number;
  negotiable: boolean;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  images: string[];
  seller: mongoose.Types.ObjectId;
  sellerId?: mongoose.Types.ObjectId;
  passportId?: mongoose.Types.ObjectId;
  verificationStatus?: 'unverified' | 'claimed' | 'pending' | 'reviewed' | 'verified' | 'rejected';
  listingQualityScore?: number;
  status: 'active' | 'published' | 'sold' | 'paused' | 'under_review' | 'rejected' | 'draft' | 'pending' | 'removed';
  views: number;
  featured: boolean;
  rarity: 'Common Vintage' | 'Rare Find' | 'Collector Grade' | 'Discontinued OEM' | 'Extremely Rare / Holy Grail';
  shippingAvailable: boolean;
  shippingCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompatibilitySchema = new Schema<ICompatibility>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    yearFrom: { type: Number, required: true },
    yearTo: { type: Number, required: true },
    variant: { type: String, default: 'All Variants' },
  },
  { _id: false }
);

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String, required: true },
    subcategory: { type: String, default: '' },
    vehicleBrand: { type: String, required: true, index: true },
    vehicleModel: { type: String, required: true, index: true },
    vehicleYear: { type: Schema.Types.Mixed, required: true },
    vehicleVariant: { type: String, default: 'Standard' },
    compatibleVehicles: [CompatibilitySchema],
    oemNumber: { type: String, default: '', trim: true, index: true },
    condition: {
      type: String,
      enum: ['NOS (New Old Stock)', 'OEM Mint', 'OEM Refurbished', 'Used - Grade A', 'Used - Restorable'],
      required: true,
    },
    partType: {
      type: String,
      enum: ['OEM Original', 'Period Aftermarket', 'Reproduction / Restomod'],
      default: 'OEM Original',
    },
    listingType: {
      type: String,
      enum: ['buy_now', 'auction', 'negotiable'],
      default: 'buy_now',
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    quantity: { type: Number, default: 1, min: 0 },
    negotiable: { type: Boolean, default: false },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, default: '' },
    },
    images: [{ type: String, required: true }],
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    passportId: { type: Schema.Types.ObjectId, ref: 'PartPassport' },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'claimed', 'pending', 'reviewed', 'verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    listingQualityScore: { type: Number, default: 85 },
    status: {
      type: String,
      enum: ['active', 'published', 'sold', 'paused', 'under_review', 'rejected', 'draft', 'pending', 'removed'],
      default: 'active',
      index: true,
    },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    rarity: {
      type: String,
      enum: ['Common Vintage', 'Rare Find', 'Collector Grade', 'Discontinued OEM', 'Extremely Rare / Holy Grail'],
      default: 'Rare Find',
    },
    shippingAvailable: { type: Boolean, default: true },
    shippingCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ListingSchema.index({ title: 'text', description: 'text', oemNumber: 'text' });
ListingSchema.index({ vehicleBrand: 1, vehicleModel: 1, categoryName: 1 });
ListingSchema.index({ seller: 1, status: 1 });
ListingSchema.index({ 'compatibleVehicles.brand': 1, 'compatibleVehicles.model': 1 });

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);

