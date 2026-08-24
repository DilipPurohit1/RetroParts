import mongoose, { Document, Schema } from 'mongoose';

export interface IPartPassport extends Document {
  listingId: mongoose.Types.ObjectId;
  originalOrReproduction: 'oem_original' | 'period_aftermarket' | 'reproduction_restomod' | 'oem_refurbished';
  sourceVehicle?: {
    make: string;
    model: string;
    year?: number | string;
    vin?: string;
    odometerKm?: number;
    notes?: string;
  };
  repairHistory?: string;
  defects?: string;
  documents: Array<{
    title: string;
    url: string;
    type: 'invoice' | 'service_log' | 'certificate' | 'photograph';
    uploadedAt: Date;
  }>;
  status: 'claimed' | 'pending' | 'reviewed' | 'verified' | 'rejected';
  statusHistory: Array<{
    status: 'claimed' | 'pending' | 'reviewed' | 'verified' | 'rejected';
    by: mongoose.Types.ObjectId;
    at: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PartPassportSchema = new Schema<IPartPassport>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      unique: true,
      index: true,
    },
    originalOrReproduction: {
      type: String,
      enum: ['oem_original', 'period_aftermarket', 'reproduction_restomod', 'oem_refurbished'],
      default: 'oem_original',
    },
    sourceVehicle: {
      make: { type: String, default: '' },
      model: { type: String, default: '' },
      year: { type: Schema.Types.Mixed },
      vin: { type: String, default: '' },
      odometerKm: { type: Number },
      notes: { type: String, default: '' },
    },
    repairHistory: { type: String, default: '' },
    defects: { type: String, default: '' },
    documents: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ['invoice', 'service_log', 'certificate', 'photograph'],
          default: 'photograph',
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['claimed', 'pending', 'reviewed', 'verified', 'rejected'],
      default: 'claimed',
      index: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['claimed', 'pending', 'reviewed', 'verified', 'rejected'],
          required: true,
        },
        by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        at: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export const PartPassport = mongoose.model<IPartPassport>('PartPassport', PartPassportSchema);
