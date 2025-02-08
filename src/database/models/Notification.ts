import { databaseModels, NOTIFICATION_TYPE } from '@/constant';
import { UserModel } from '@/interfaces';
import { Model, Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: NOTIFICATION_TYPE,
      required: [true, 'Type is required'],
    },
    text: {
      type: String,
      required: true,
    },
    isHTML: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    isExternalLink: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<UserModel> =
  models?.Notification ||
  model<UserModel>(databaseModels.NOTIFICATION, NotificationSchema);
export default Notification;
