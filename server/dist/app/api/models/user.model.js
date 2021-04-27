"use strict";
// @ts-nocheck
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
;
;
;
;
;
;
const userSchema = new mongoose_1.Schema({
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
        validate: [validator_1.default.isEmail, 'No valid email address provided.'],
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
                type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Club',
            required: false,
        },
        _parentIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Parent',
                required: false,
            }],
        _activityIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Activity',
                required: false,
            }],
        _milestoneIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Milestone',
                required: false,
            }],
        _goalIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Goal',
                required: false,
            }],
        _challengeIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'ChallengeParticipated',
                required: false,
            }],
        lastManualPoints: {
            type: Number,
            default: 0,
        },
    },
    member: {
        _clubId: {
            type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Challenge',
                required: false,
            }],
        _cyclistIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Cyclist',
                required: false,
            }],
        _memberIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Member',
                required: false,
            }],
    },
    parent: {
        _cyclistIds: [{
                type: mongoose_1.Schema.Types.ObjectId,
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
exports.userSchema = userSchema;
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    try {
        return bcrypt_1.default.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            }
            ;
            bcrypt_1.default.hash(user.password, salt, (errHash, hash) => {
                if (errHash) {
                    throw errHash;
                }
                ;
                user.password = hash;
                return next();
            });
        });
    }
    catch (e) {
        return next(e);
    }
    ;
});
userSchema.methods.comparePassword = function (candidatePass, cb) {
    const user = this;
    bcrypt_1.default.compare(candidatePass, user.password, (err, match) => {
        if (err) {
            return cb(err, null);
        }
        ;
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
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.model.js.map