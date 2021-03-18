import {
  default as mongoose,
  Schema,
  Document
} from 'mongoose';

import {
  IUser
} from './user.model';

interface IPopup extends Document {
  addedPt: number;
  previousPt: number;
  currentPt: number;
  text: string;
  seen: boolean;
  _userId: IUser['_id'];
};

const popupSchema: Schema = new Schema({
  addedPt: {
    type: Number,
  },
  previousPt: {
    type: Number,
  },
  currentPt: {
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