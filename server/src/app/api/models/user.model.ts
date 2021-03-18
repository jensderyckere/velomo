import {
    default as mongoose,
    Schema,
    Document
} from 'mongoose';

import {
    default as bcrypt
} from 'bcrypt';

import {
    default as validator
} from 'validator';

import {
    INotification,
    IClub,
    IParent,
    ICyclist,
    IMember,
    IActivity,
    IMilestone,
    IChallengeParticipated,
    IGoal,
    IChallenge
} from '../models';

interface IProfile {
    avatar: string;
    bio: string;
    uniqueCode: string;
    _notificationIds: Array < INotification['_id'] > ;
};

interface ICyclistInfo {
    pts: number;
    _milestoneIds: Array < IMilestone['_id'] > ;
    _challengeIds: Array < IChallengeParticipated['_id'] > ;
    _goalIds: Array < IGoal['_id'] > ;
    _clubId: IClub['_id'];
    _parentIds: Array < IParent['_id'] > ;
    _activityIds: Array < IActivity['_id'] > ;
};

interface IMemberInfo {
    _clubId: IClub['_id'];
};

interface IClubInfo {
    name: string;
    cover: string;
    location: string;
    _challengeIds: Array < IChallenge['_id'] > ;
    _cyclistIds: Array < ICyclist['_id'] > ;
    _memberIds: Array < IMember['_id'] > ;
};

interface IParentInfo {
    _cyclistIds: Array < ICyclist['_id'] > ;
};

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    profile: IProfile;
    cyclist: ICyclistInfo;
    member: IMemberInfo;
    club: IClubInfo;
    parent: IParentInfo;
    comparePassword(candidatePass: String, cb: Function): void;
};

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false,
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'No valid email address provided.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 42,
    },
    role: {
        type: String,
        enum: ['cyclist', 'parent', 'club', 'clubmember', 'admin'],
        default: 'cyclist',
        required: true,
    },
    profile: {
        avatar: {
            type: String,
            required: false,
            unique: false,
        },
        bio: {
            type: String,
            required: false,
            unique: false,
        },
        category: {
            type: String,
            required: false,
            unique: false,
        },
        setupCompleted: {
            type: Boolean,
            required: true,
            default: false,
        },
        uniqueCode: {
            type: String,
            required: true,
            unique: true,
        },
        _notificationIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Notification',
            unique: false,
            required: false,
        }],
    },
    cyclist: {
        pts: {
            type: Number,
            default: 0,
        },
        _clubId: {
            type: Schema.Types.ObjectId,
            ref: 'Club',
            required: false,
        },
        _parentIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Parent',
            required: false,
        }],
        _activityIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            required: false,
        }],
        _milestoneIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Milestone',
            required: false,
        }],
        _goalIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Goal',
            required: false,
        }],
        _challengeIds: [{
            type: Schema.Types.ObjectId,
            ref: 'ChallengeParticipated',
            required: false,
        }],
    },
    member: {
        _clubId: {
            type: Schema.Types.ObjectId,
            ref: 'Club',
            required: false,
        },
    },
    club: {
        name: {
            type: String,
            required: false,
            unique: false,
        },
        location: {
            type: String,
            required: false,
            unique: false,
        },
        cover: {
            type: String,
            required: false,
            unique: false,
        },
        _challengeIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Challenge',
            required: false,
        }],
        _cyclistIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Cyclist',
            required: false,
        }],
        _memberIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Member',
            required: false,
        }],
    },
    parent: {
        _cyclistIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Cyclist',
            required: false,
        }],
    },
    _createdAt: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    _modifiedAt: {
        type: Number,
        required: false,
        default: null,
    },
    _deletedAt: {
        type: Number,
        required: false,
        default: null,
    },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

userSchema.pre('save', function (next) {
    const user: IUser = this as IUser;

    if (!user.isModified('password')) return next();

    try {
        return bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            };

            bcrypt.hash(user.password, salt, (errHash, hash) => {
                if (errHash) {
                    throw errHash;
                };

                user.password = hash;
                return next();
            });
        });
    } catch (e) {
        return next(e);
    };
});

userSchema.methods.comparePassword = function (candidatePass: String, cb: Function) {
    const user = this;
    bcrypt.compare(candidatePass, user.password, (err, match) => {
        if (err) {
            return cb(err, null);
        };

        return cb(null, match);
    });
};

userSchema.virtual('notification', {
    ref: 'Notification',
    localField: '_notificationIds',
    foreignField: '_id',
    justOne: false,
});

userSchema.virtual('clubInfo', {
    ref: 'Club',
    localField: '_clubId',
    foreignField: '_id',
    justOne: true,
});

userSchema.virtual('parentInfo', {
    ref: 'Parent',
    localField: '_parentIds',
    foreignField: '_id',
    justOne: false,
});

userSchema.virtual('cyclistInfo', {
    ref: 'Cyclist',
    localField: '_cyclistIds',
    foreignField: '_id',
    justOne: false,
});

userSchema.virtual('memberInfo', {
    ref: 'Member',
    localField: '_memberIds',
    foreignField: '_id',
    justOne: false,
});

userSchema.virtual('activityInfo', {
    ref: 'Activity',
    localField: '_activityIds',
    foreignField: '_id',
    justOne: false,
});

const User = mongoose.model < IUser > ('User', userSchema);

export {
    IUser,
    userSchema,
    User,
};