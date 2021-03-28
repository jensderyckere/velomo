import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IRequirement extends Document {
  type: string;
  title: string;
  description: string;
  goal_distance: number;
  goal_duration: string;
  goal_days: number;
  goal_challenges: number;
  goal_goals: number;
  goal_events: number;
  _clubId: IUser['_id'];
  _createdAt: string;
  _modifiedAt: string;
};

const requirementSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['distance', 'duration', 'days', 'challenges', 'goals', 'events'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goal_distance: {
    type: Number,
    required: false,
  },
  goal_duration: {
    type: String,
    required: false,
  },
  goal_days: {
    type: Number,
    required: false,
  },
  goal_challenges: {
    type: Number,
    required: false,
  },
  goal_goals: {
    type: Number,
    required: false,
  },
  goal_events: {
    type: Number,
    required: false,
  },
  _clubId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

const Requirement = mongoose.model < IRequirement > ('Requirement', requirementSchema);

export {
  Requirement,
  requirementSchema,
  IRequirement,
};