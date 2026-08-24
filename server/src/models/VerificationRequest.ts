import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  targetType: 'seller' | 'listing' | 'passport';
  targetId: mongoose.Types.ObjectId;
  documents: Array<{
    title: string;
    url: string;
    type?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: {
      type: String,
      enum: ['seller', 'listing', 'passport'],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    documents: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: 'document' },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const VerificationRequest = mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema);
