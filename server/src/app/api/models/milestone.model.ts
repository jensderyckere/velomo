import { default as mongoose, Schema, Document } from 'mongoose';

interface IMilestone extends Document {
  title: string;
  description: string;
  type: string;
  goal: number;
  completed: boolean;
  seen: boolean;
  badge: string;
  progress: number;
  _completedAt: string;
};

const milestoneSchema: Schema = new Schema({
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
    enum: ['ride', 'month', 'year', 'challenges', 'goals'],
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
  },
  badge: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  _completedAt: {
    type: String,
  },
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

const Milestone = mongoose.model<IMilestone>('Milestone', milestoneSchema);

export {
  milestoneSchema,
  IMilestone,
  Milestone,
};
