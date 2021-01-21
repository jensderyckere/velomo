import { default as mongoose, Document, Schema } from 'mongoose';

import { IUser } from './user.model';

interface IParent extends Document {
  _userId: IUser['_id'];
  _createdAt: number;
};

const parentSchema: Schema = new Schema({
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
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});

parentSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

const Parent = mongoose.model<IParent>('Parent', parentSchema);

export {
  Parent,
  parentSchema,
  IParent,
};
