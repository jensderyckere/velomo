import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IUser,
  ISubmission
} from '.';

interface IChallenge extends Document {
  title: string;
  shortContent: string;
  content: string;
  images: Array < string > ;
  video: string;
  badge: string;
  difficulty: string;
  type: string;
  distance: number;
  duration: number;
  start_date: string;
  end_date: string;
  participants: Array < IUser['_id'] > ;
  submissions: Array < ISubmission['_id'] > ;
  _createdAt: string;
  _userId: IUser['_id'];
};

const challengeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  shortContent: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  video: {
    type: String,
  },
  badge: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Makkelijk', 'Medium', 'Moeilijk'],
  },
  type: {
    type: String,
    enum: ['distance', 'duration', 'image', 'activity', 'video'],
  },
  distance: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Submission',
  }],
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

const Challenge = mongoose.model < IChallenge > ('Challenge', challengeSchema);

export {
  IChallenge,
  challengeSchema,
  Challenge,
};