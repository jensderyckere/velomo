import { default as mongoose, Document, Schema } from 'mongoose';
import { IUser } from './user.model';

interface IActivity extends Document {
  title: string;
  description: string;
  type: string;
  activity: object;
  images: Array<string>;
  feeling: number;
  experience: number;
  _userId: IUser['_id'];
  _createdAt: number;
  _modifiedAt: number;
};

const activitySchema: Schema = new Schema({
  title: {
    type: String,
    unique: false,
    required: true,
    default: "Jouw activiteit"
  },
  description: {
    type: String,
    unique: false,
    required: true,
  },
  type: {
    type: String,
    unique: false,
    required: true,
  },
  activity: {
    type: Object,
    unique: false,
    required: true,
  },
  images: [{
    type: String,
    required: false,
    unique: false,
  }],
  feeling: {
    type: Number,
    default: 0,
  },
  experience: {
    type: Number,
    default: 0,
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  _createdAt: {
    type: Number,
    required: false,
    default: Date.now(),
  },
  _modifiedAt: {
    type: Number,
    required: false,
  },
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

activitySchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export {
  Activity,
  activitySchema,
  IActivity,
};
