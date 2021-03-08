import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IGoal extends Document {
  title: string;
  description: string;
  type: string;
  goal: number;
  completed: boolean;
  seen: boolean;
  badge: string;
  progress: number;
  start_date: string;
  end_date: string;
  _cyclistId: IUser['_id'];
  _creatorId: IUser['_id'];
  _completedAt: string;
};

const goalSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['ride', 'month', 'year'],
  },
  goal: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  seen: {
    type: Boolean,
    default: true,
  },
  badge: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  _cyclistId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  _creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  _completedAt: {
    type: String,
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

const Goal = mongoose.model < IGoal > ('Goal', goalSchema);

export {
  goalSchema,
  IGoal,
  Goal,
};