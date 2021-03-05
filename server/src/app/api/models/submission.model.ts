import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IUser,
  IActivity
} from '.';

interface ISubmission extends Document {
  text: string;
  image: string;
  video: string;
  approved: boolean;
  activity: IActivity['_id'];
  _userId: IUser['_id'];
  _createdAt: number;
};

const submissionSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _createdAt: {
    type: Number,
    required: false,
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

const Submission = mongoose.model < ISubmission > ('Submission', submissionSchema);

export {
  ISubmission,
  submissionSchema,
  Submission,
};