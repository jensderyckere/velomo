import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Auth
} from "../../services";

import {
  Notification
} from "../models";

export default class NotificationController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Get user
      const userId = this.auth.checkId(req, res);
      
      const notifications = await Notification.find({_receiverId: userId}).sort({_createdAt: -1}).populate({path: '_senderId'}).exec();

      if (!notifications) return res.status(200).json([]);

      return res.status(200).json(notifications);
    } catch (error) {
      next(error);
    };
  };

  viewNotification = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Get id of notification
      const {
        id
      } = req.params;

      const notification = await Notification.findByIdAndUpdate(id, {
        $set: {
          viewed: true,
        },
      }).exec();

      return res.status(200).json(notification);
    } catch (error) {
      next(error);
    };
  };
};