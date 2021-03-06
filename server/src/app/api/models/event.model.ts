import {
  default as mongoose,
  Document,
  Schema
} from 'mongoose';

import {
  IUser,
} from './user.model';

interface IDetails {
  location: string;
  speed: number;
  date: string;
  duration: string;
};

interface IParticipant {
  _userId: IUser['_id'];
  present: boolean;
};

interface IEvent extends Document {
  title: string;
  description: string;
  details: IDetails;
  gpxFile: string;
  type: string;
  participants: Array<IParticipant>;
  _creatorId: IUser['_id'];
  _createdAt: string;
  _modifiedAt: string;
};

const eventSchema : Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    location: {
      type: String,
      required: false,
    },
    speed: {
      type: Number,
      required: false,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: false,
    },
  },
  gpxFile: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['Ride', 'Team'],
    required: true,
  },
  participants: [{
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    present: {
      type: Boolean,
      default: false,
    },
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  _creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _createdAt: {
    type: String,
    required: false,
    default: Date.now(),
  },
  _modifiedAt: {
    type: Number,
    required: false,
  },
}, {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

const Event = mongoose.model < IEvent > ('Event', eventSchema);

export {
  Event,
  eventSchema,
  IEvent,
};