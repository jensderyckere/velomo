import {
    default as mongoose,
    Document,
    Schema
} from 'mongoose';

import {
    IUser
} from './user.model';

interface IReset extends Document {
    _userId: IUser['_id'];
    token: string;
    _expiresAt: number;
};

const resetSchema: Schema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    token: {
        type: String,
        unique: true,
        required: true,
    },
    _expiresAt: {
        type: Date,
        default: Date.now(),
        expires: 3600,
    },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

resetSchema.virtual('id').get(function (this: IUser) {
    return this._id;
});

resetSchema.virtual('user', {
    ref: 'User',
    localField: '_userId',
    foreignField: '_id',
    justOne: true,
});

const Reset = mongoose.model < IReset > ('Reset', resetSchema);

export {
    Reset,
    resetSchema,
    IReset
};