import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  seller: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  listing?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
