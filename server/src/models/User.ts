import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  googleId?: string | null;
  authProvider: 'local' | 'google' | 'both';
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  sellerType?: 'individual' | 'collector' | 'mechanic' | 'garage' | 'supplier';
  avatar: string;
  bio: string;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  isVerifiedSeller: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  sellerRating: number;
  sellerReviewCount: number;
  savedVehicles: Array<{
    brand: string;
    model: string;
    year?: number | string;
    variant?: string;
  }>;
  vacationMode?: {
    active: boolean;
    until?: Date;
    message?: string;
  };
  createdAt: Date;
  updatedAt: Date;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false, default: null },
    googleId: { type: String, default: null, sparse: true, index: true },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'both'],
      default: 'local',
    },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
      index: true,
    },
    sellerType: {
      type: String,
      enum: ['individual', 'collector', 'mechanic', 'garage', 'supplier'],
      default: 'individual',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    bio: { type: String, default: '' },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    isVerifiedSeller: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    sellerRating: { type: Number, default: 5.0, min: 0, max: 5 },
    sellerReviewCount: { type: Number, default: 0 },
    savedVehicles: [
      {
        brand: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Schema.Types.Mixed },
        variant: { type: String },
      },
    ],
    vacationMode: {
      active: { type: Boolean, default: false },
      until: { type: Date },
      message: { type: String, default: '' },
    },
  },
  { timestamps: true }
);


UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

