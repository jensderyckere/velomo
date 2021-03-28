import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Auth
} from "../../services";

import {
  PointSystem,
  Reward,
  User
} from "../models";

export default class PointsystemController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  getSystem = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        clubId
      } = req.params;

      const user = await User.findById(clubId).exec();

      let system: any = false;

      if (!user) {
        return res.status(404).json({
          message: "No user has been found",
          redirect: false,
          status: 404,
        });
      };

      const checkIfSystem = await PointSystem.find({
        _clubId: clubId
      }).populate({
        path: '_clubId'
      }).populate({
        path: '_rewardIds'
      }).populate({
        path: '_requirementIds'
      }).exec();

      if (checkIfSystem) {
        system = checkIfSystem;
      };

      return res.status(200).json(system);
    } catch (e) {
      next(e);
    };
  };

  createSystem = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const checkIfSystem = await PointSystem.find({
        _clubId: id
      }).exec();

      if (checkIfSystem) {
        return res.status(400).json({
          message: "Already made",
          redirect: false,
          status: 400,
        });
      };

      const newSystem = new PointSystem({
        _clubId: id,
      });

      const system = await newSystem.save();

      return res.status(200).json(system);
    } catch (e) {
      next(e);
    };
  };

  deleteSystem = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const checkIfSystem = await PointSystem.findOne({
        _clubId: id
      }).exec();

      if (String(checkIfSystem._clubId) === String(user._id)) {
        return res.status(400).json({
          message: "Unauthorized",
          redirect: false,
          status: 400,
        });
      };

      const deleted = await PointSystem.findByIdAndRemove(checkIfSystem._id).exec();

      return res.status(200).json(deleted);
    } catch (e) {
      next(e);
    };
  };

  getReward = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        id
      } = req.params;

      const reward = await Reward.findById(id).exec();

      if (!reward) {
        return res.status(404).json({
          message: "No reward has been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(reward);
    } catch (e) {
      next(e);
    };
  };

  createReward = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        title,
        name,
        description,
        avatar,
        banner,
        needed_amount,
      } = req.body;

      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const checkIfSystem = await PointSystem.findOne({
        _clubId: id
      }).exec();

      if (checkIfSystem) {
        return res.status(400).json({
          message: "Already made",
          redirect: false,
          status: 400,
        });
      };

      const createdReward = new Reward({
        title,
        name,
        description,
        avatar,
        banner,
        needed_amount,
      });

      const reward = await createdReward.save();

      const updatedSystem = await checkIfSystem.update({
        $push: {
          _rewardsIds: reward._id,
        },
      });

      return res.status(200).json(updatedSystem);
    } catch (e) {
      next(e);
    };
  };

  deleteReward = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const id = this.auth.checkId(req, res); 

      const { rewardId } = req.params;

      const user = await User.findById(id).exec();
      const reward = await Reward.findById(rewardId).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const checkIfSystem = await PointSystem.findOne({
        _clubId: id
      }).exec();

      if (checkIfSystem) {
        return res.status(400).json({
          message: "Already made",
          redirect: false,
          status: 400,
        });
      };

      const updatedSystem = await checkIfSystem.update({
        $pull: {
          _rewardsIds: reward._id,
        }
      });

      return res.status(200).json(updatedSystem);
    } catch (e) {
      next(e);
    };
  };
};