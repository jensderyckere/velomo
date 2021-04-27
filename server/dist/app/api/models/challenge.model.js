"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = exports.challengeSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
;
const challengeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    shortContent: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: [{
            type: String,
        }],
    video: {
        type: String,
    },
    badge: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Makkelijk', 'Medium', 'Moeilijk'],
    },
    type: {
        type: String,
        enum: ['distance', 'duration', 'image', 'activity', 'video'],
    },
    distance: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    },
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    submissions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Submission',
        }],
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.challengeSchema = challengeSchema;
const Challenge = mongoose_1.default.model('Challenge', challengeSchema);
exports.Challenge = Challenge;
//# sourceMappingURL=challenge.model.js.map