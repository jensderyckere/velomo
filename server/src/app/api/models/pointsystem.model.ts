import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import { IRequirement } from './requirement.model';

import { IReward } from './reward.model';

import { 
  IUser 
} from './user.model';

interface IPointSystem extends Document {
  _clubId: IUser['_id'];
  _rewardsIds: Array<IReward['_id']>;
  _requirementIds: Array<IRequirement['_id']>
  _createdAt: Number;
  _modifiedAt: Number;
};

const pointSystemSchema : Schema = new Schema({
  _clubId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _rewardIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Reward',
  }],
  _requirementIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Requirement',
  }],
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

const PointSystem = mongoose.model < IPointSystem > ('PointSystem', pointSystemSchema);

export {
  PointSystem,
  IPointSystem,
  pointSystemSchema,
};
