import { Request, Response, NextFunction } from "express";
import { Auth } from "../../services";
import { Activity, User } from "../models";

export default class MilestoneController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  calculateMyProgressAndShow = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Arrays
      let arrayOfMilestones = [];

      // Check user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      const allActivities = await Activity.find({_userId: userId}).exec();

      for (let i = 0; i < user.cyclist._milestoneIds.length; i ++) {
      };

      return res.status(200).json(user);
    } catch (e) {
      next(e);
    };
  };
};
