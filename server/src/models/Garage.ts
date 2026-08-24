import mongoose, { Document, Schema } from 'mongoose';

export interface IRestorationEntry extends Document {
  garageVehicleId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'engine' | 'bodywork' | 'paint' | 'electrical' | 'brakes' | 'interior' | 'general';
  cost: number;
  date: Date;
  odometerKm?: number;
  partListingId?: mongoose.Types.ObjectId;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGarageVehicle extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  variant?: string;
  nickname?: string;
  registrationNumber?: string;
  vin?: string;
  currentOdometerKm: number;
  status: 'in_restoration' | 'running' | 'project_build' | 'stored' | 'completed';
  coverPhoto?: string;
  photos: string[];
  totalRestorationSpend: number;
  createdAt: Date;
  updatedAt: Date;
}


const RestorationEntrySchema = new Schema<IRestorationEntry>(
  {
    garageVehicleId: { type: Schema.Types.ObjectId, ref: 'GarageVehicle', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['engine', 'bodywork', 'paint', 'electrical', 'brakes', 'interior', 'general'],
      default: 'general',
    },
    cost: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now },
    odometerKm: { type: Number },
    partListingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

const GarageVehicleSchema = new Schema<IGarageVehicle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    variant: { type: String, default: 'Standard' },
    nickname: { type: String, default: '' },
    registrationNumber: { type: String, default: '' },
    vin: { type: String, default: '' },
    currentOdometerKm: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_restoration', 'running', 'project_build', 'stored', 'completed'],
      default: 'in_restoration',
    },
    coverPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    },
    photos: [{ type: String }],
    totalRestorationSpend: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GarageVehicle = mongoose.model<IGarageVehicle>('GarageVehicle', GarageVehicleSchema);
export const RestorationEntry = mongoose.model<IRestorationEntry>('RestorationEntry', RestorationEntrySchema);
