import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Auth
} from "../../services";

import {
  Challenge,
  ChallengeParticipated,
  IChallenge,
  IChallengeParticipated,
  Submission,
  User
} from "../models";

import {
  default as Moment
} from "moment";

import 'moment/locale/nl-be';

export default class ChallengeController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  getClubChallenges = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Find user
      const {
        userId
      } = req.params;
      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({
          message: "No user has been found",
          redirect: false,
          status: 404,
        });
      };

      // Get challenges from club
      let challenges;

      if (user.role === "cyclist") {
        challenges = await Challenge.find({
          _userId: userId
        }).populate({
          path: '_challengeId'
        }).exec();
      };

      if (user.role === "club") {
        challenges = await User.findById(userId).populate({
          path: 'club',
          populate: {
            path: '_challengeIds'
          }
        }).exec();
      };

      if (!challenges) {
        return res.status(404).json({
          message: "No challenges have been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(challenges);
    } catch (e) {
      next(e);
    };
  };

  getMyChallenges = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
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

      // Get challenges from myself
      const participatedChallenges = await ChallengeParticipated.find({
        _userId: userId
      }).populate({
        path: '_challengeId'
      }).exec();

      if (!participatedChallenges) {
        return res.status(404).json({
          message: "No challenges have been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(participatedChallenges);
    } catch (e) {
      next(e);
    };
  };

  getDetailedChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Get challenge
      const {
        challengeId
      } = req.params;

      const challenge = await Challenge.findById(challengeId).populate({
        path: 'submissions',
        populate: {
          path: '_userId'
        }
      })
      .populate({
        path: 'submissions',
        populate: {
          path: 'activity',
        }
      })
      .exec();

      if (!challenge) {
        return res.status(404).json({
          message: "No challenge has been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(challenge);
    } catch (e) {
      next(e);
    };
  };

  getDetailedParticipation = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Get challenge participation
      const {
        challengeId
      } = req.params;

      // Find user
      const _userId = this.auth.checkId(req, res);
      const user = await User.findById(_userId).exec();

      const participatedChallenge = await ChallengeParticipated.findOne({
        _challengeId: challengeId,
        _userId: _userId
      }).populate({
        path: '_challengeId'
      }).exec();

      if (!participatedChallenge) {
        return res.status(404).json({
          message: "No participation has been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(participatedChallenge);
    } catch (e) {
      next(e);
    };
  };

  createChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Find user
      const _userId = this.auth.checkId(req, res);
      const user = await User.findById(_userId).exec();

      // Body
      const {
        title,
        shortContent,
        content,
        images,
        video,
        badge,
        difficulty,
        type,
        distance,
        start_date,
        end_date
      } = req.body;

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
      const createdChallenge: IChallenge = new Challenge({
        title,
        shortContent,
        content,
        images,
        video,
        badge,
        difficulty,
        type,
        distance,
        start_date,
        end_date,
        _userId
      });

      const savedChallenge = await createdChallenge.save();

      // Push to creator
      await User.findByIdAndUpdate(_userId, {
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
  editChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      // Challenge id
      const {
        challengeId
      } = req.params;
      const {
        title,
        shortContent,
        content,
        images,
        video,
        badge,
        difficulty,
        type,
        distance,
        start_date,
        end_date
      } = req.body;

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

      const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, {
        title,
        shortContent,
        content,
        images,
        video,
        badge,
        difficulty,
        type,
        distance,
        start_date,
        end_date
      }).exec();

      return res.status(200).json(updatedChallenge);
    } catch (e) {
      next(e);
    };
  };

  // Delete challenge
  deleteChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      // Challenge id
      const {
        challengeId
      } = req.params;

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
      const allParticipatedChallenges = await ChallengeParticipated.find({
        _challengeId: challengeId
      }).exec();
      const allUsers = await User.find({
        role: "cyclist"
      }).exec();

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

  participateChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
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
      const {
        challengeId
      } = req.body;

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
          'cyclist._challengeIds': createdParticipation._id,
        },
      });

      return res.status(200).json(createdParticipation);
    } catch (e) {
      next(e);
    };
  };

  // Withdraw from challenge
  withdrawChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
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
      const {
        challengeId
      } = req.body;

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
      const participatedChallenge = await ChallengeParticipated.findOne({
        _userId: userId,
        _challengeId: challenge._id
      }).exec();

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

  viewRandomDashboardChallenge = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
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

      if (!user.cyclist._challengeIds) {
        return res.status(404).json({
          message: "No challenges have been found",
          redirect: false,
          status: 404,
        });
      };

      let arrayOfChallenges = [];
      const challenges = await Challenge.find().populate({
        path: '_userId'
      }).exec();

      for (let i = 0; i < challenges.length; i++) {
        if (challenges[i].participants.includes(userId)) {
          arrayOfChallenges.push(challenges[i]);
        };
      };

      const randomDigit = Math.floor(Math.random() * arrayOfChallenges.length);

      const challenge = arrayOfChallenges[randomDigit];
      const participants = challenge.participants;
      let arrayOfParticipants = [];

      if (challenge.type === 'image' || challenge.type === 'video' || challenge.type === 'activity') {
        const result = await Challenge.findById(challenge._id).populate({
          path: 'submissions',
          populate: {
            path: 'activity',
            populate: {
              path: '_userId'
            }
          }
        })
        .populate({
          path: '_userId'
        })
        .exec();

        return res.status(200).json({
          challenge: result,
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
                options: {
                  sort: {
                    _createdAt: -1
                  }
                }
              },
            }).exec();

          let distance = 0;

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[j].activity.checkpoints) {
              const totalDistance = user.cyclist._activityIds[j].activity.total_distance;

              // Check if between dates
              if (Moment(user.cyclist._activityIds[j].activity.starting_time).isBetween(challenge.start_date, challenge.end_date)) {
                distance = distance + totalDistance;
              };
            };
          };

          const object = {
            user: user,
            distance: distance
          };
          arrayOfParticipants.push(object);

          if (distance >= challenge.distance) {
            await ChallengeParticipated.findOneAndUpdate({
              _userId: user._id,
              _challengeId: challenge._id
            }, {
              completed: true,
              seen: false,
            }).exec();
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
                options: {
                  sort: {
                    _createdAt: -1
                  }
                }
              },
            }).exec();

          let duration = Moment.duration('00:00:00');

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[i].activity.checkpoints) {
              const totalDuration = user.cyclist._activityIds[i].activity.total_duration;
              // Check if between dates
              if (Moment(user.cyclist._activityIds[j].activity.starting_time).isBetween(challenge.start_date, challenge.end_date)) {
                duration = Moment.duration(duration).add(Moment.duration(totalDuration));
              };
            };
          };

          const object = {
            user: user,
            duration: duration
          };
          arrayOfParticipants.push(object);

          if (duration.asMilliseconds() >= Moment.duration(challenge.duration).asMilliseconds()) {
            await ChallengeParticipated.findOneAndUpdate({
              _userId: user._id,
              _challengeId: challenge._id
            }, {
              completed: true,
              seen: false,
            }).exec();
          };
        };
      };

      return res.status(200).json({
        challenge: challenge,
        participants: arrayOfParticipants,
      });
    } catch (e) {
      next(e);
    };
  };

  viewParticipantMonthlyCharts = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Params
      const {
        challengeId
      } = req.params;

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
          message: "Incorrect usage",
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
                options: {
                  sort: {
                    _createdAt: -1
                  }
                }
              },
            }).exec();

          let distance = 0;

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[j].activity.checkpoints) {
              const totalDistance = user.cyclist._activityIds[j].activity.total_distance;

              // Check if between dates
              if (Moment(user.cyclist._activityIds[j].activity.starting_time).isBetween(challenge.start_date, challenge.end_date)) {
                distance = distance + totalDistance;
              };
            };
          };

          const object = {
            user: user,
            distance: distance
          };
          arrayOfParticipants.push(object);

          if (distance >= challenge.distance) {
            await ChallengeParticipated.findOneAndUpdate({
              _userId: user._id,
              _challengeId: challenge._id
            }, {
              completed: true,
              seen: false,
            }).exec();
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
                options: {
                  sort: {
                    _createdAt: -1
                  }
                }
              },
            }).exec();

          let duration = Moment.duration('00:00:00');

          for (let j = 0; j < user.cyclist._activityIds.length; j++) {
            if (user.cyclist._activityIds[i].activity.checkpoints) {
              const totalDuration = user.cyclist._activityIds[i].activity.total_duration;
              // Check if between dates
              if (Moment(user.cyclist._activityIds[j].activity.starting_time).isBetween(challenge.start_date, challenge.end_date)) {
                duration = Moment.duration(duration).add(Moment.duration(totalDuration));
              };
            };
          };

          const object = {
            user: user,
            duration: duration
          };
          arrayOfParticipants.push(object);

          if (duration.asMilliseconds() >= Moment.duration(challenge.duration).asMilliseconds()) {
            await ChallengeParticipated.findOneAndUpdate({
              _userId: user._id,
              _challengeId: challenge._id
            }, {
              completed: true,
              seen: false,
            }).exec();
          };
        };
      };

      return res.status(200).json(arrayOfParticipants);
    } catch (e) {
      next(e);
    };
  };

  // Submit submission
  submitSubmission = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Find user
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      // Challenge id
      const {
        challengeId
      } = req.params;

      const challenge = await Challenge.findById(challengeId).populate({
        path: 'submissions'
      }).exec();

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

      // Create submission
      const {
        text,
        image,
        video,
        activity,
        _userId
      } = req.body;

      // Check if already submitted
      for (let i = 0; i < challenge.submissions.length; i++) {
        if (challenge.submissions[i]._userId === _userId) {
          return res.status(400).json({
            message: "User has already submitted",
            redirect: false,
            status: 400,
          });
        };
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
          'cyclist._challengeIds': createdParticipation._id,
        },
      });

      const object = {
        text: text ? text : '',
        image: image ? image : '',
        video: video ? video : '',
        activity: activity ? activity : null,
        _userId: _userId ? _userId : '',
        _createdAt: Date.now(),
      };

      const createdSubmission = new Submission(object);
      const savedSubmission = await createdSubmission.save();

      const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, {
        $set: {
          submissions: savedSubmission._id,
        }
      }).exec();

      return res.status(200).json(updatedChallenge);
    } catch (e) {
      next(e);
    };
  };

  // Approve submission
  approveSubmission = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      // Check if params exist
      const {
        challengeId,
        userId
      } = req.params;

      const challenge = await Challenge.findById(challengeId).populate({path: 'submissions'}).exec();
      const user = await User.findById(userId).exec();

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

      for (let i = 0; i < challenge.submissions.length; i++) {
        if (String(challenge.submissions[i]._userId) === String(userId)) {          
          // Find submission
          await Submission.findOneAndUpdate({_id: challenge.submissions[i].id}, {
            $set: {
              approved: true,
            },
          });
        };
      };

      // Find participation model
      const participation = await ChallengeParticipated.findOne({
        _userId: userId,
        _challengeId: challengeId
      });

      if (!participation) {
        return res.status(404).json({
          message: "No participation",
          redirect: false,
          status: 404,
        });
      };

      const updatedParticipation = await participation.update({
        completed: true,
        seen: false,
      });

      return res.status(200).json(updatedParticipation);
    } catch (e) {
      next(e);
    };
  };
};
