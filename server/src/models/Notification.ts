import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  type: 'wanted_match' | 'wanted-match' | 'order_update' | 'order-update' | 'new_message' | 'new-message' | 'verification-result' | 'listing_approved' | 'seller_verified' | 'price_drop' | 'new_offer';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  payload?: Record<string, any>;
  data?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'wanted_match',
        'wanted-match',
        'order_update',
        'order-update',
        'new_message',
        'new-message',
        'verification-result',
        'listing_approved',
        'seller_verified',
        'price_drop',
        'new_offer',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
    payload: { type: Schema.Types.Mixed },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

