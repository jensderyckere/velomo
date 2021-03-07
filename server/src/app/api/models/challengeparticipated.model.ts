import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IChallenge
} from './challenge.model';

import {
  IUser
} from './user.model';

interface IChallengeParticipated extends Document {
  _userId: IUser['_id'];
  _challengeId: IChallenge['_id'];
  progress: string;
  completed: boolean;
  seen: boolean;
  _participatedAt: string;
};

const challengeParticipatedSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
  },
  progress: {
    type: String,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  seen: {
    type: Boolean,
    default: true,
  },
  _participatedAt: {
    type: String,
    required: true,
    default: Date.now(),
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

const ChallengeParticipated = mongoose.model < IChallengeParticipated > ('ChallengeParticipated', challengeParticipatedSchema);

export {
  IChallengeParticipated,
  challengeParticipatedSchema,
  ChallengeParticipated,
};