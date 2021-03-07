import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IMember extends Document {
  _userId: IUser['_id'];
  _createdAt: number;
};

const memberSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
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

memberSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Member = mongoose.model < IMember > ('Member', memberSchema);

export {
  Member,
  memberSchema,
  IMember,
};