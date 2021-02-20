import { Request, Response, NextFunction } from "express";
import { Auth } from "../../services";
import { Challenge, ChallengeParticipated, IChallenge, IChallengeParticipated, User } from "../models";

export default class ChallengeController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  createChallenge = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      // Body
      const { title, content, images, video, badge, difficulty, type, distance, start_date, end_date } = req.body;

      if (!user) {
        return res.status(404).json({
          message: "No user has been found",
          redirect: false,
          status: 404,
        });
      };

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized call",
          redirect: false,
          status: 401,
        });
      };

      // Create challenge
      const createdChallenge: IChallenge = new Challenge({title, content, images, video, badge, difficulty, type, distance, start_date, end_date}); 

      const savedChallenge = await createdChallenge.save();

      // Push to creator
      await User.findByIdAndUpdate(userId, {
        $push: {
          'club._challengeIds': savedChallenge._id,
        },
      });

      return res.status(200).json(savedChallenge);
    } catch (e) {
      next(e);
    };
  };

  // Delete challenge
  deleteChallenge = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      // Challenge id
      const { challengeId } = req.params;

      const challenge = await Challenge.findById(challengeId).exec();

      if (!user) {
        return res.status(404).json({
          message: "No user has been found",
          redirect: false,
          status: 404,
        });
      };

      if (!challenge) {
        return res.status(404).json({
          message: "No challenge has been found",
          redirect: false,
          status: 404,
        });
      };

      if (user.role !== 'club' || challenge._userId !== userId) {
        return res.status(401).json({
          message: "Unauthorized call",
          redirect: false,
          status: 401,
        });
      };

      // Delete from participants

      // Delete from creator

      // Delete activity
      return res.status(200);
    } catch (e) {
      next(e);
    }
  };

  participateChallenge = async (req: Request, res: Response, next: NextFunction): Promise <Response> => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({
          message: "No user has been found",
          redirect: false,
          status: 404,
        });
      };

      // Body
      const { challengeId } = req.body;

      // Find challenge
      const challenge = await Challenge.findById(challengeId).exec();

      if (!challenge) {
        return res.status(404).json({
          message: "No challenge has been found",
          redirect: false,
          status: 404,
        });
      };

      if (challenge.participants.includes(userId)) {
        return res.status(404).json({
          message: "User already participating",
          redirect: false,
          status: 400,
        });
      };

      await Challenge.findByIdAndUpdate(userId, {
        $push: {
          participants: userId,
        }
      });

      // Create participation
      const participatedChallenge: IChallengeParticipated = new ChallengeParticipated({
        _userId: userId,
        _challengeId: challengeId,
      });

      const createdParticipation = await participatedChallenge.save();

      await User.findByIdAndUpdate(userId, {
        $push: {
          'cyclist._activityIds': createdParticipation._id,
        },
      });

      return res.status(200).json(createdParticipation);
    } catch (e) {
      next(e);
    };
  };

  // Withdraw from challenge
  withdrawChallenge = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      return res.status(200);
    } catch (e) {
      next(e);
    };
  };
};
