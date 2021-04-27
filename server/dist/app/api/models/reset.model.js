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
exports.resetSchema = exports.Reset = void 0;
const mongoose_1 = __importStar(require("mongoose"));
;
const resetSchema = new mongoose_1.Schema({
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.resetSchema = resetSchema;
resetSchema.virtual('id').get(function () {
    return this._id;
});
resetSchema.virtual('user', {
    ref: 'User',
    localField: '_userId',
    foreignField: '_id',
    justOne: true,
});
const Reset = mongoose_1.default.model('Reset', resetSchema);
exports.Reset = Reset;
//# sourceMappingURL=reset.model.js.map