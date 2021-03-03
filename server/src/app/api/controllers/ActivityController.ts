import { Request, Response, NextFunction } from "express";

import { Auth } from "../../services";
import { Activity, IActivity, User } from "../models";

export default class ActivityController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  showActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Get id
      const { id } = req.params;

      if (!id) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      const activity = await Activity.findOne({_id: id}).populate('user').exec();

      if (!activity) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      return res.status(200).json(activity);
    } catch (e) {
      next();
    };
  };

  deleteActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const activityId = req.params.id;
  
      if (!activityId) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      const deleted = await Activity.findByIdAndRemove(activityId).exec();

      if (!deleted) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      return res.status(200).json(deleted);
    } catch (e) {
      next();
    };
  };

  editActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const activityId = req.params.id;
      const { object, title, description, type, images, feeling, experience } = req.body;
  
      if (!activityId) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      const updated = await Activity.findByIdAndUpdate(activityId, {
        $set: {
          activity: object,
          title: title,
          description: description,
          type: type,
          images: images,
          feeling: feeling,
          experience: experience,
        },
      });

      if (!updated) return res.status(404).json({
        message: "No activity has been found",
        redirect: false,
        status: 404,
      });

      return res.status(200).json(updated);
    } catch (e) {
      next();
    };
  };

  uploadActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const id = this.auth.checkId(req, res);
  
      const { object, title, description, type, images, feeling, experience } = req.body;
  
      if (!object) return res.status(404).json({
        message: "The file hasn't been uploaded correctly",
        redirect: false,
        status: 404,
      });
  
      let activity;
  
      if (!images) {
        let newActivity : IActivity = new Activity({
          title: title,
          description: description,
          type: type,
          activity: object,
          _userId: id,
          feeling: feeling,
          experience: experience,
        });
  
        activity = await newActivity.save();
  
        await User.findByIdAndUpdate(activity._userId, {
          $push: {
            'cyclist._activityIds': activity._id,
          },
        });
      } else {
        let newActivity : IActivity = new Activity({
          title: title,
          description: description,
          type: type,
          activity: object,
          _userId: id,
          images: images,
          feeling: feeling,
          experience: experience,
        });
  
        activity = await newActivity.save();
  
        await User.findByIdAndUpdate(activity._userId, {
          $push: {
            'cyclist._activityIds': activity._id,
          },
        });
      };
  
      return res.status(200).json(activity);
    } catch (e) {
      next(e);
    }
  };

  createActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const id = this.auth.checkId(req, res);

      const { object, title, description, type, images, feeling, experience } = req.body;

      if (!object) return res.status(400).json({
        message: "The activity hasn't been created correctly",
        redirect: false,
        status: 400,
      });
  
      let activity;
  
      if (!images) {
        let newActivity : IActivity = new Activity({
          title: title,
          description: description,
          type: type,
          activity: object,
          _userId: id,
          feeling: feeling,
          experience: experience,
        });
  
        activity = await newActivity.save();
  
        await User.findByIdAndUpdate(activity._userId, {
          $push: {
            'cyclist._activityIds': activity._id,
          },
        });
      } else {
        let newActivity : IActivity = new Activity({
          title: title,
          description: description,
          type: type,
          activity: object,
          _userId: id,
          images: images,
          feeling: feeling,
          experience: experience,
        });
  
        activity = await newActivity.save();
  
        await User.findByIdAndUpdate(activity._userId, {
          $push: {
            'cyclist._activityIds': activity._id,
          },
        });
      };
  
      return res.status(200).json(activity);
    } catch (e) {
      next();
    };
  };
};
