import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IUser
} from './user.model';

interface ICyclist extends Document {
  _userId: IUser['_id'];
  _createdAt: number;
};

const cyclistSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: true,
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

cyclistSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Cyclist = mongoose.model < ICyclist > ('Cyclist', cyclistSchema);

export {
  Cyclist,
  cyclistSchema,
  ICyclist,
};