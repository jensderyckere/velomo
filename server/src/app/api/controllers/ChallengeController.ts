import { Request, Response, NextFunction } from "express";
import { Auth } from "../../services";
import { Challenge, ChallengeParticipated, IChallenge, IChallengeParticipated, User } from "../models";
import { default as Moment } from "moment";
import 'moment/locale/nl-be';

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

  // Edit challenge
  

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
      const allParticipatedChallenges = await ChallengeParticipated.find({_challengeId: challengeId}).exec();
      const allUsers = await User.find({role: "cyclist"}).exec();

      for (let i = 0; i < allParticipatedChallenges.length; i++) {
        for (let j = 0; j < allUsers.length; j++) {
          if (allUsers[j].cyclist._challengeIds.includes(allParticipatedChallenges[i]._id)) {
            await User.findByIdAndUpdate(allUsers[j]._id, {
              $pull: {
                'cyclist._challengeIds': allParticipatedChallenges[i]._id,
              },
            }).exec();
          };
        };
      };

      // Delete from creator
      await User.findByIdAndUpdate(challenge._userId, {
        $pull: {
          'club._challengeIds': challengeId,
        },
      }).exec();

      // Delete activity
      const deletedChallenge = await Challenge.findByIdAndDelete(challengeId).exec();

      return res.status(200).json(deletedChallenge);
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

      await Challenge.findByIdAndUpdate(challengeId, {
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

      if (!challenge.participants.includes(userId)) {
        return res.status(404).json({
          message: "User isn't participating",
          redirect: false,
          status: 400,
        });
      };

      await Challenge.findByIdAndUpdate(challengeId, {
        $pull: {
          participants: user._id,
        },
      }).exec();

      // Delete participated challenge
      const participatedChallenge = await ChallengeParticipated.findOne({_userId: userId, _challengeId: challenge._id}).exec();

      await User.findByIdAndUpdate(userId, {
        $pull: {
          'cyclist._challengeIds': participatedChallenge._id,
        },
      }).exec();

      const deletedChallenge = await ChallengeParticipated.findByIdAndDelete(participatedChallenge._id);

      return res.status(200).json(deletedChallenge);
    } catch (e) {
      next(e);
    };
  };

  viewParticipantMonthlyCharts = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      // Params
      const { challengeId } = req.params;

      // Variables
      let arrayOfParticipants = [];
      const challenge = await Challenge.findById(challengeId).exec();
      const participants = challenge.participants;

      if (!challenge) {
        return res.status(404).json({
          message: "No challenge has been found",
          redirect: false,
          status: 404,
        });
      };

      // Get date of challenge
      const startDate = Moment(challenge.start_date).format('LL');
      const endDate = Moment(challenge.end_date).format('LL');

      if (challenge.type === 'image' || challenge.type === 'video') {
        return res.status(400).json({
          message: "No challenge has been found",
          redirect: false,
          status: 400,
        });
      };

      if (challenge.type === 'distance') {
        // Calculate distances between dates
        for (let i = 0; i < participants.length; i++) {
          const user = await User.findById(participants[i])                
          .populate({
            path: 'cyclist',
            populate: {
                path: '_activityIds',
                options: { sort: {_createdAt: -1} }
            },
          }).exec();

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[i].activity.checkpoints) {
              const startingTime = Moment(user.cyclist._activityIds[i].activity.starting_time).format('LL');
              const totalDistance = user.cyclist._activityIds[i].activity.total_distance;

              let distance = 0;

              // Check if between dates
              if (Moment(startingTime).isBetween(startDate, endDate)) {
                distance += totalDistance;
              };

              const object = {user: user, distance: distance};
              arrayOfParticipants.push(object);
            };
          };
        };
      };

      if (challenge.type === 'duration') {
        // Calculate distances between dates
        for (let i = 0; i < participants.length; i++) {
          const user = await User.findById(participants[i])                
          .populate({
            path: 'cyclist',
            populate: {
                path: '_activityIds',
                options: { sort: {_createdAt: -1} }
            },
          }).exec();

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[i].activity.checkpoints) {
              const startingTime = Moment(user.cyclist._activityIds[i].activity.starting_time).format('LL');
              const totalDuration = user.cyclist._activityIds[i].activity.total_duration;

              let duration = Moment.duration('00:00:00');

              // Check if between dates
              if (Moment(startingTime).isBetween(startDate, endDate)) {
                duration = Moment.duration(duration).add(Moment.duration(totalDuration));
              };

              const object = {user: user, distance: duration};
              arrayOfParticipants.push(object);
            };
          };
        };
      };

      if (challenge.type === 'duration') {

      };

      return res.status(200).json(arrayOfParticipants);
    } catch (e) {
      next(e);
    };
  };

  // Check if completed
};
