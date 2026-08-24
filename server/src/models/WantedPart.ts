import mongoose, { Document, Schema } from 'mongoose';

export interface IWantedOffer {
  seller: mongoose.Types.ObjectId;
  listingId?: mongoose.Types.ObjectId;
  offerPrice: number;
  message: string;
  contactNumber?: string;
  createdAt: Date;
}

export interface IWantedPart extends Document {
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
  location: {
    city: string;
    state: string;
  };
  referenceImages: string[];
  requester: mongoose.Types.ObjectId;
  status: 'searching' | 'matches_found' | 'seller_contacted' | 'fulfilled' | 'closed';
  offers: IWantedOffer[];
  matchingListings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WantedOfferSchema = new Schema<IWantedOffer>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
    offerPrice: { type: Number, required: true },
    message: { type: String, required: true },
    contactNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const WantedPartSchema = new Schema<IWantedPart>(
  {
    title: { type: String, required: true, trim: true },
    vehicleBrand: { type: String, required: true, index: true },
    vehicleModel: { type: String, required: true, index: true },
    vehicleYear: { type: Schema.Types.Mixed, required: true },
    vehicleVariant: { type: String, default: 'Standard' },
    category: { type: String, required: true },
    description: { type: String, required: true },
    targetBudget: { type: Number, required: true },
    urgency: {
      type: String,
      enum: ['urgent', 'moderate', 'flexible'],
      default: 'moderate',
    },
    conditionRequired: {
      type: String,
      enum: ['Any Condition', 'NOS Only', 'Good Used', 'Restorable'],
      default: 'Good Used',
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
    },
    referenceImages: [{ type: String }],
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['searching', 'matches_found', 'seller_contacted', 'fulfilled', 'closed'],
      default: 'searching',
      index: true,
    },
    offers: [WantedOfferSchema],
    matchingListings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
);

export const WantedPart = mongoose.model<IWantedPart>('WantedPart', WantedPartSchema);
