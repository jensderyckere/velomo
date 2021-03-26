import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Auth
} from "../../services";

import {
  Event,
  Comment,
} from "../models";

export default class CommentController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  getComments = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

      const event = await Event.findById(eventId).exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      const comments = await Comment.find({
        eventId: eventId
      }).sort({
        _createdAt: -1
      }).populate({
        path: 'commenterId'
      }).exec();

      return res.status(200).json(comments || []);
    } catch (e) {
      next(e);
    };
  };

  createComment = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

      const {
        text,
      } = req.body;

      const event = await Event.findById(eventId).exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      const userId = this.auth.checkId(req, res);

      const newComment = new Comment({
        text: text,
        commenterId: userId,
        eventId: eventId,
      });

      const comment = await newComment.save();

      return res.status(200).json(comment);
    } catch (e) {
      next(e);
    };
  };

  editComment = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        commentId
      } = req.params;

      const {
        text
      } = req.body;

      const userId = this.auth.checkId(req, res);

      const comment = await Comment.findById(commentId).exec();

      if (String(comment.commenterId) !== String(userId)) return res.status(404).json({
        message: "Comment can't be edited",
        redirect: false,
        status: 401,
      });

      const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
          text: text,
          _modifiedAt: String(Date.now()),
        }
      }).exec();

      return res.status(200).json(updatedComment);
    } catch (e) {
      next(e);
    };
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        commentId
      } = req.params;

      const userId = this.auth.checkId(req, res);

      const comment = await Comment.findById(commentId).exec();

      if (String(comment.commenterId) !== String(userId)) return res.status(404).json({
        message: "Comment can't be edited",
        redirect: false,
        status: 401,
      });

      const deletedComment = await Comment.findByIdAndDelete(commentId).exec();

      return res.status(200).json(deletedComment);
    } catch (e) {
      next(e);
    };
  };
};