import { NextFunction, Request, Response } from "express";
import { Auth } from "src/app/services";
import { Goal, IGoal, User } from "../models";

export default class GoalController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  showGoal = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const { goalId } = req.params;

      // Find all goals
      const goals = await Goal.find({_id: goalId}).populate({path: '_cyclistId'}).populate({path: '_creatorId'}).sort({_createdAt: -1}).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  showUserGoals = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const { userId } = req.params;

      // Find all goals
      const goals = await Goal.find({_cyclistId: userId}).populate({path: '_cyclistId'}).populate({path: '_creatorId'}).sort({_createdAt: -1}).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  showCreatorGoals = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const { userId } = req.params;

      // Find all goals
      const goals = await Goal.find({_creatorId: userId}).populate({path: '_cyclistId'}).populate({path: '_creatorId'}).sort({_createdAt: -1}).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  createGoal = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const _creatorId = this.auth.checkId(req, res);
      const { title, description, type, goal, badge, start_date, end_date, _cyclistId } = req.body;

      const createdGoal : IGoal = new Goal({
        title, description, type, goal, badge, start_date, end_date, _cyclistId, _creatorId
      });

      const savedGoal = await createdGoal.save();

      return res.status(200).json(savedGoal);
    } catch (e) {
      next(e);
    };
  };

  editGoal = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const { id } = req.params;
      const { title, description, type, goal, badge, start_date, end_date } = req.body;

      const updatedGoal = await Goal.findByIdAndUpdate(id, {
        $set: {
          title,
          description,
          type,
          goal,
          badge,
          start_date,
          end_date,
        },
      }).exec();

      return res.status(200).json(updatedGoal);
    } catch (e) {
      next(e);
    };
  };

  deleteGoal = async (req: Request, res: Response, next: NextFunction):Promise<Response> => {
    try {
      const { id } = req.params;

      const deletedGoal = await Goal.findByIdAndDelete(id).exec();

      return res.status(200).json(deletedGoal);
    } catch (e) {
      next(e);
    };
  };

  checkGoals = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      if (user.role === 'cyclist') {
        const details = user.populate({path : 'cyclist', populate: {path: '_activityIds'}});
      };

      next();
    } catch (e) {
      next(e);
    };
  };
};