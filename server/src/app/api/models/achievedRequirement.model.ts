import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IRequirement
} from './requirement.model';

import {
  IUser
} from './user.model';

interface IAchievedRequirement extends Document {
  _userId: IUser['_id'];
  _requirementId: IRequirement['_id'];
  _createdAt: string;
  _modifiedAt: string;
};

const achievedRequirementSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _requirementId: {
    type: Schema.Types.ObjectId,
    ref: 'Requirement',
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

const AchievedRequirement = mongoose.model < IAchievedRequirement > ('AchievedRequirement', achievedRequirementSchema);

export {
  AchievedRequirement,
  achievedRequirementSchema,
  IAchievedRequirement,
};