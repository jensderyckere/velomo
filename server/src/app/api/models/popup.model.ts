import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IPopup extends Document {
  addedXp: number;
  previousXp: number;
  currentXp: number;
  text: string;
  seen: boolean;
  _userId: IUser['_id'];
};

const popupSchema: Schema = new Schema({
  addedXp: {
    type: Number,
  },
  previousXp: {
    type: Number,
  },
  currentXp: {
    type: Number,
  },
  text: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false,
  },
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

const Popup = mongoose.model < IPopup > ('Popup', popupSchema);

export {
  Popup,
  popupSchema,
  IPopup,
};