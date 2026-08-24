import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleVariant {
  name: string;
  yearFrom?: number;
  yearTo?: number;
  engine?: string;
}

export interface IVehicle extends Omit<Document, 'model'> {
  brand: string;
  model: string;
  type: 'car' | 'bike';
  yearFrom: number;
  yearTo: number;
  variants: Array<string | IVehicleVariant>;
  popular: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VehicleVariantSchema = new Schema<IVehicleVariant>(
  {
    name: { type: String, required: true },
    yearFrom: { type: Number },
    yearTo: { type: Number },
    engine: { type: String },
  },
  { _id: false }
);

const VehicleSchema = new Schema<IVehicle>(
  {
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true, index: true },
    type: { type: String, enum: ['car', 'bike'], required: true },
    yearFrom: { type: Number, required: true },
    yearTo: { type: Number, required: true },
    variants: [Schema.Types.Mixed],
    popular: { type: Boolean, default: false },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

VehicleSchema.index({ brand: 1, model: 1 });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);

