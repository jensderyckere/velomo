import { default as mongoose, Schema, Document } from 'mongoose';
import { IUser } from './user.model';

interface INotification extends Document {
  _userId: IUser['_id'];
  text: string;
  viewed: boolean;
  _createdAt: number,
  _modifiedAt: number,
  _deletedAt: number;
};

const notificationSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: false,
    required: true,
  },
  text: {
    type: String,
    unique: false,
    required: true,
  },
  viewed: {
    type: Boolean,
    unique: false,
    required: true,
    default: false,
  },
  _createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
},
  _modifiedAt: {
      type: Number,
      required: false,
      default: null,
  },
  _deletedAt: {
      type: Number,
      required: false,
      default: null,       
  }, 
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

notificationSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export {
  INotification,
  Notification,
  notificationSchema,
};
