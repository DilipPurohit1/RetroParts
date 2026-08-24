import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reporter?: mongoose.Types.ObjectId;
  targetType: 'listing' | 'user';
  targetId: mongoose.Types.ObjectId;
  listing?: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'open' | 'resolved' | 'pending' | 'action_taken' | 'dismissed';
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User' },
    targetType: {
      type: String,
      enum: ['listing', 'user'],
      default: 'listing',
      index: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
    reason: {
      type: String,
      required: true,
    },
    details: { type: String, default: '' },
    status: {
      type: String,
      enum: ['open', 'resolved', 'pending', 'action_taken', 'dismissed'],
      default: 'open',
      index: true,
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
