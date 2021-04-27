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
exports.requirementSchema = exports.Requirement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
;
const requirementSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['distance', 'duration', 'days', 'challenges', 'goals', 'events'],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    goal_distance: {
        type: Number,
        required: false,
    },
    goal_duration: {
        type: String,
        required: false,
    },
    goal_days: {
        type: Number,
        required: false,
    },
    goal_challenges: {
        type: Number,
        required: false,
    },
    goal_goals: {
        type: Number,
        required: false,
    },
    goal_events: {
        type: Number,
        required: false,
    },
    _clubId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.requirementSchema = requirementSchema;
const Requirement = mongoose_1.default.model('Requirement', requirementSchema);
exports.Requirement = Requirement;
//# sourceMappingURL=requirement.model.js.map