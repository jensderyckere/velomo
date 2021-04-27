"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class CommentController {
    constructor(auth) {
        this.getComments = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const event = await models_1.Event.findById(eventId).exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                const comments = await models_1.Comment.find({
                    eventId: eventId
                }).sort({
                    _createdAt: -1
                }).populate({
                    path: 'commenterId'
                }).exec();
                return res.status(200).json(comments || []);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createComment = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const { text, } = req.body;
                const event = await models_1.Event.findById(eventId).exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                const userId = this.auth.checkId(req, res);
                const newComment = new models_1.Comment({
                    text: text,
                    commenterId: userId,
                    eventId: eventId,
                });
                const comment = await newComment.save();
                return res.status(200).json(comment);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.editComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const { text } = req.body;
                const userId = this.auth.checkId(req, res);
                const comment = await models_1.Comment.findById(commentId).exec();
                if (String(comment.commenterId) !== String(userId))
                    return res.status(404).json({
                        message: "Comment can't be edited",
                        redirect: false,
                        status: 401,
                    });
                const updatedComment = await models_1.Comment.findByIdAndUpdate(commentId, {
                    $set: {
                        text: text,
                        _modifiedAt: String(Date.now()),
                    }
                }).exec();
                return res.status(200).json(updatedComment);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const userId = this.auth.checkId(req, res);
                const comment = await models_1.Comment.findById(commentId).exec();
                if (String(comment.commenterId) !== String(userId))
                    return res.status(404).json({
                        message: "Comment can't be edited",
                        redirect: false,
                        status: 401,
                    });
                const deletedComment = await models_1.Comment.findByIdAndDelete(commentId).exec();
                return res.status(200).json(deletedComment);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.auth = auth;
    }
    ;
}
exports.default = CommentController;
;
//# sourceMappingURL=CommentController.js.map