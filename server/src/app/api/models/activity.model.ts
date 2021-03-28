import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IExtendedActivity {
  start_date_local: string;
};

interface IActivity extends Document {
  result: IExtendedActivity;
  stravaId: string;
  _userId: IUser['_id'];
  _createdAt: string;
  _modifiedAt: number;
};

const activitySchema: Schema = new Schema({
  result: {
    type: Object,
    required: true,
  },
  stravaId: {
    type: String,
    required: true,
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  _createdAt: {
    type: String,
    required: false,
    default: Date.now(),
  },
  _modifiedAt: {
    type: Number,
    required: false,
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

activitySchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Activity = mongoose.model < IActivity > ('Activity', activitySchema);

export {
  Activity,
  activitySchema,
  IActivity,
};