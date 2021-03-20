import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import { 
  IEvent 
} from './event.model';

import {
  IUser
} from './user.model';

interface IComment extends Document {
  text: string;
  commenterId: IUser['_id'];
  eventId: IEvent['_id'];
  _createdAt: string;
  _modifiedAt: string;
};

const commentSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  commenterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  eventId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
  _createdAt: {
    type: String,
    default: Date.now(),
  },
  _modifiedAt: {
    type: String,
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

const Comment = mongoose.model < IComment > ('Comment', commentSchema);

export {
  Comment,
  commentSchema,
  IComment,
};
