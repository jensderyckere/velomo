import {
  Request,
  Response,
  NextFunction
} from "express";

import moment from "moment";

import {
  Auth
} from "../../services";

import {
  AchievedRequirement,
  Activity,
  ChallengeParticipated,
  Event,
  Goal,
  IAchievedRequirement,
  IPopup,
  PointSystem,
  Popup,
  Requirement,
  Reward,
  User,
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

      const checkIfSystem = await PointSystem.findOne({
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

      if (String(checkIfSystem._clubId) !== String(user._id)) {
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

  editReward = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        title,
        name,
        description,
        avatar,
        banner,
        needed_amount,
      } = req.body;

      const { rewardId } = req.params;

      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const reward = await Reward.findByIdAndUpdate(rewardId, {
        $set: {
          title: title,
          name: name,
          description: description,
          avatar: avatar,
          banner: banner,
          needed_amount: needed_amount,
        },
      }).exec();

      return res.status(200).json(reward);
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

      if (!checkIfSystem) {
        return res.status(404).json({
          message: "No system",
          redirect: false,
          status: 404,
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

  getRequirement = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        id
      } = req.params;

      const requirement = await Requirement.findById(id).exec();

      if (!requirement) {
        return res.status(404).json({
          message: "No requirement has been found",
          redirect: false,
          status: 404,
        });
      };

      return res.status(200).json(requirement);
    } catch (e) {
      next(e);
    };
  };

  getRequirementsStatus = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      if (user.role === 'cyclist') {
        const achievedRequirements = await AchievedRequirement.find({_userId: userId}).exec();
        const requirements = await Requirement.find({_clubId: user.cyclist._clubId}).exec();

        let arrayOfRequirements = [];

        for (let requirement of requirements) {
          let object = {requirement: requirement, success: false};

          for (let achieved of achievedRequirements){
            if (achieved._requirementId === requirement._id) {
              object.success = true;
            };
          };

          arrayOfRequirements.push(object);
        };

        return res.status(200).json(arrayOfRequirements);
      };

      return res.status(200).json(false);
    } catch (e) {
      next(e);
    };
  };

  createRequirement = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        title,
        type,
        description,
        goal_distance,
        goal_duration,
        goal_days,
        goal_challenges,
        goal_goals,
        goal_events,
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

      const newRequirement = new Requirement({
        type: type,
        title: title,
        description: description,
        goal_distance: goal_distance || '',
        goal_duration: goal_duration || '',
        goal_days: goal_days || '',
        goal_challenges: goal_challenges || '',
        goal_goals: goal_goals || '',
        goal_events: goal_events || '',
        _clubId: user._id,
      });

      const requirement = await newRequirement.save();

      await checkIfSystem.update({
        $push: {
          _requirementIds: requirement._id,
        },
      });

      return res.status(200).json(requirement);
    } catch (e) {
      next(e);
    };
  };

  editRequirement = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        title,
        type,
        description,
        goal_distance,
        goal_duration,
        goal_days,
        goal_challenges,
        goal_goals,
        goal_events,
      } = req.body;

      const { requirementId } = req.params;

      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role !== 'club') {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const requirement = await Requirement.findByIdAndUpdate(requirementId, {
        $set: {
          title,
          type,
          description,
          goal_distance,
          goal_duration,
          goal_days,
          goal_challenges,
          goal_goals,
          goal_events,
        }
      }).exec();

      return res.status(200).json(requirement);
    } catch (e) {
      next(e);
    };
  };

  deleteRequirement = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const id = this.auth.checkId(req, res); 

      const { requirementId } = req.params;

      const user = await User.findById(id).exec();
      const requirement = await Requirement.findById(requirementId).exec();

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

      if (!checkIfSystem) {
        return res.status(404).json({
          message: "No system",
          redirect: false,
          status: 404,
        });
      };

      const updatedSystem = await checkIfSystem.update({
        $pull: {
          _requirementIds: requirement._id,
        }
      });

      return res.status(200).json(updatedSystem);
    } catch (e) {
      next(e);
    };
  };

  giveManualPoints = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const id = this.auth.checkId(req, res);

      const {
        userId,
        points,
      } = req.body;

      if (points > 3) {
        return res.status(400).json({
          message: "Max. of 3 points",
          redirect: false,
          status: 400,
        });
      };

      const user = await User.findById(id).exec();
      const cyclist = await User.findById(userId).exec();

      let result : any;

      if (user.role === 'club' || user.role === 'clubmember') {
        if (cyclist.cyclist.lastManuelPoints === 0) {
          result = cyclist.update({
            $set: {
              'cyclist.pts': cyclist.cyclist.pts + points,
              'cyclist.lastManualPoints': Date.now(),
            },
          });
        } else {
          if (moment(moment(Date.now())).diff(cyclist.cyclist.lastManuelPoints, 'days') >  7) {
            result = cyclist.update({
              $set: {
                'cyclist.pts': cyclist.cyclist.pts + points,
                'cyclist.lastManualPoints': Date.now(),
              },
            });
          } else {
            return res.status(400).json({
              message: "Already added this week",
              redirect: false,
              status: 400,
            });
          };
        };
      } else {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    };
  };

  checkRequirements = async (req: Request, res: Response, next: NextFunction): Promise < void > => {
    try {
      const id = this.auth.checkId(req, res);

      const user = await User.findById(id).exec();

      if (user.role === "cyclist") {
        if (user.cyclist._clubId) {
          const system = await PointSystem.findOne({_clubId: user.cyclist._clubId}).exec();
          
          if (system) {
            const activities = await Activity.find({_userId: id}).exec();
            const requirements = await Requirement.find({_clubId: user.cyclist._clubId}).exec();

            for (let requirement of requirements) {
              for (let activity of activities) {
                let distance = 0;
                let duration = 0;
                let days = 0;
                let challenges = 0;
                let goals = 0;
                let events = 0;

                if (moment(moment(activity.result.start_date_local).format('YYYY-MM-DD')).isBetween(moment('2021-01-01'), moment('2021-12-31'))) {
                  distance += activity.result.distance;
                  duration += activity.result.moving_time;
                  days += 1;
                };

                const participatedChallenges = await ChallengeParticipated.find({_userId: id}).exec();

                for (let participation of participatedChallenges) {
                  if (participation.completed) {
                    challenges += 1;
                  };
                };

                const participatedEvents = await Event.find().exec();

                for (let participation of participatedEvents) {
                  if (participation.participants.includes(user._id)) {
                    events += 1;
                  };
                };

                const participatedGoals = await Goal.find({_cyclistId: user._id, completed: true}).exec();

                goals = participatedGoals ? participatedGoals.length : 0;

                const succesRequirement = await AchievedRequirement.findOne({_requirementId: requirement._id, _userId: user._id}).exec();

                if (!succesRequirement) {
                  if (requirement.type === 'distance') {
                    let status = false;

                    if (requirement.goal_distance <= distance) {
                      status = true;
                    };

                    if (moment.duration(requirement.goal_duration).asSeconds() <=  duration) {
                      status = true;
                    };

                    if (requirement.goal_days <= days) {
                      status = true;
                    };

                    if (requirement.goal_challenges <= challenges) {
                      status = true;
                    };

                    if (requirement.goal_goals <= goals) {
                      status = true;
                    };

                    if (requirement.goal_events <= events) {
                      status = true;
                    };

                    if (status) {
                      const newPopup: IPopup = new Popup({
                        addedPt: 2,
                        previousPt: user.cyclist.pts,
                        currentPt: user.cyclist.pts + 2,
                        text: `Je hebt een mijlpaal in het puntensysteem "${requirement.title}" voltooid. Daarvoor verkrijg je een aantal punten. Proficiat!`,
                        _userId: id,
                      });

                      await newPopup.save();

                      const newSuccessRequirement : IAchievedRequirement = new AchievedRequirement({
                        _userId: id,
                        _requirementId: requirement.id,
                      });

                      await newSuccessRequirement.save();
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
