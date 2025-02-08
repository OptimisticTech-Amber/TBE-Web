import { databaseModels, NOTIFICATION_TYPE } from '@/constant';
import { NotificationModel } from '@/interfaces';
import { Model, Schema, model, models } from 'mongoose';

const NotificationSchema: Schema<NotificationModel> = new Schema(
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

const Notification: Model<NotificationModel> =
  models?.Notification ||
  model<NotificationModel>(databaseModels.NOTIFICATION, NotificationSchema);
export default Notification;
