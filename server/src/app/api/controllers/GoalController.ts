import {
  NextFunction,
  Request,
  Response
} from "express";

import {
  Auth
} from "src/app/services";

import {
  Goal,
  IGoal,
  IPopup,
  Popup,
  User
} from "../models";

import {
  default as Moment
} from "moment";

import 'moment/locale/nl-be';

export default class GoalController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  showGoal = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        goalId
      } = req.params;

      // Find all goals
      const goals = await Goal.find({
        _id: goalId
      }).populate({
        path: '_cyclistId'
      }).populate({
        path: '_creatorId'
      }).sort({
        _createdAt: -1
      }).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  showUserGoals = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        userId
      } = req.params;

      // Find all goals
      const goals = await Goal.find({
        _cyclistId: userId
      }).populate({
        path: '_cyclistId'
      }).populate({
        path: '_creatorId'
      }).sort({
        _createdAt: -1
      }).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  showCreatorGoals = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        userId
      } = req.params;

      // Find all goals
      const goals = await Goal.find({
        _creatorId: userId
      }).populate({
        path: '_cyclistId'
      }).populate({
        path: '_creatorId'
      }).sort({
        _createdAt: -1
      }).exec();

      if (!goals) return res.status(200).json([]);

      return res.status(200).json(goals);
    } catch (e) {
      next(e);
    };
  };

  createGoal = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const _creatorId = this.auth.checkId(req, res);
      const {
        title,
        description,
        type,
        goal,
        badge,
        start_date,
        end_date,
        _cyclistId
      } = req.body;

      const createdGoal: IGoal = new Goal({
        title,
        description,
        type,
        goal,
        badge,
        start_date,
        end_date,
        _cyclistId,
        _creatorId
      });

      const savedGoal = await createdGoal.save();

      return res.status(200).json(savedGoal);
    } catch (e) {
      next(e);
    };
  };

  editGoal = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        id
      } = req.params;
      const {
        title,
        description,
        type,
        goal,
        badge,
        start_date,
        end_date
      } = req.body;

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

  deleteGoal = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        id
      } = req.params;

      const deletedGoal = await Goal.findByIdAndDelete(id).exec();

      return res.status(200).json(deletedGoal);
    } catch (e) {
      next(e);
    };
  };

  showGoalStats = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        userId,
        goalId
      } = req.params;

      const user = await User.findById(userId).populate({
        path: 'cyclist',
        populate: {
          path: '_activityIds'
        }
      }).exec();

      const goal = await Goal.findById(goalId).exec();

      if (!goal || !user) {
        return res.status(404).json({
          message: 'Not found',
          status: 404,
          redirect: false,
        });
      };

      let maxRide = 0;
      let totalDistance = 0;

      for (let i = 0; i < user.cyclist._activityIds.length; i++) {
        if (Moment(user.cyclist._activityIds[i].activity.starting_time).isBetween(goal.start_date, goal.end_date)) {
          if (user.cyclist._activityIds[i].activity.checkpoints) {
            if (user.cyclist._activityIds[i].activity.total_distance > maxRide) {
              maxRide = user.cyclist._activityIds[i].activity.total_distance;
            };

            totalDistance = totalDistance + user.cyclist._activityIds[i].activity.total_distance;
          };
        };
      };

      return res.status(200).json({
        progress: goal.type === 'ride' ? maxRide : totalDistance,
        goal: goal.goal,
      });
    } catch (e) {
      next(e);
    };
  };

  checkGoals = async (req: Request, res: Response, next: NextFunction): Promise < void > => {
    try {
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      if (user.role === 'cyclist') {
        const details = user.populate({
          path: 'cyclist',
          populate: {
            path: '_activityIds'
          }
        });

        const goals = await Goal.find({
          _cyclistId: userId
        }).exec();

        for (let i = 0; i < goals.length; i++) {
          if (goals[i].completed === false) {
            // Check if between dates
            for (let j = 0; j < details.cyclist._activityIds.length; j++) {
              let distance = 0;

              if (details.cyclist._activityIds[j].activity.checkpoints) {
                if (Moment(details.cyclist._activityIds[j].activity.starting_time).isBetween(goals[i].start_date, goals[i].end_date)) {
                  if (goals[i].type === 'ride') {
                    if (details.cyclist._activityIds[j].activity.total_distance >= goals[i].goal) {
                      await Goal.findByIdAndUpdate(goals[i]._id, {
                        $set: {
                          completed: true,
                          _completedAt: String(Date.now()),
                        },
                      });

                      const newPopup: IPopup = new Popup({
                        addedXp: 500,
                        previousXp: user.cyclist.xp,
                        currentXp: user.cyclist.xp + 500,
                        text: `Je hebt de doelstelling "${goals[i].title}" voltooid. Daarvoor verkrijg je een aantal XP-punten en een badge. Proficiat!`,
                        _userId: userId,
                      });

                      await newPopup.save();
                    };
                  };

                  if (goals[i].type === 'month' || goals[i].type === 'year') {
                    distance = distance + details.cyclist._activityIds[j].activity.total_distance;

                    if (distance >= goals[i].goal) {
                      await Goal.findByIdAndUpdate(goals[i]._id, {
                        $set: {
                          completed: true,
                          _completedAt: String(Date.now()),
                        },
                      });

                      const newPopup: IPopup = new Popup({
                        addedXp: 500,
                        previousXp: user.cyclist.xp,
                        currentXp: user.cyclist.xp + 500,
                        text: `Je hebt de doelstelling "${goals[i].title}" voltooid. Daarvoor verkrijg je een aantal XP-punten en een badge. Proficiat!`,
                        _userId: userId,
                      });

                      await newPopup.save();
                    };
                  };
                };
              };
            };
          };
        };
      };

      next();
    } catch (e) {
      next(e);
    };
  };
};