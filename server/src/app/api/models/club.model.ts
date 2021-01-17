import { default as mongoose, Document, Schema } from 'mongoose';

import { IUser } from './user.model';

interface IClub extends Document {
  _userId: IUser['_id'];
  _createdAt: number;
};

const clubSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  _createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

clubSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Club = mongoose.model<IClub>('Club', clubSchema);

export {
  Club,
  clubSchema,
  IClub,
};
