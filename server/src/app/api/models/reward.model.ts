import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

interface IReward extends Document {
  title: string;
  description: string;
  name: string;
  avatar: string;
  banner: string;
  needed_amount: number;
  _createdAt: string;
  _modifiedAt: string;
};

const rewardSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  needed_amount: {
    type: Number,
    required: true,
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

const Reward = mongoose.model < IReward > ('Reward', rewardSchema);

export {
  Reward,
  rewardSchema,
  IReward,
};