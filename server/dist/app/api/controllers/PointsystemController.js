"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
class PointsystemController {
    constructor(auth) {
        this.getSystem = async (req, res, next) => {
            try {
                const { clubId } = req.params;
                const user = await models_1.User.findById(clubId).exec();
                let system = false;
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
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
                }
                ;
                return res.status(200).json(system);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createSystem = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                if (checkIfSystem) {
                    return res.status(400).json({
                        message: "Already made",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                const newSystem = new models_1.PointSystem({
                    _clubId: id,
                });
                const system = await newSystem.save();
                return res.status(200).json(system);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteSystem = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                if (String(checkIfSystem._clubId) !== String(user._id)) {
                    return res.status(400).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                const deleted = await models_1.PointSystem.findByIdAndRemove(checkIfSystem._id).exec();
                return res.status(200).json(deleted);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getReward = async (req, res, next) => {
            try {
                const { id } = req.params;
                const reward = await models_1.Reward.findById(id).exec();
                if (!reward) {
                    return res.status(404).json({
                        message: "No reward has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                return res.status(200).json(reward);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createReward = async (req, res, next) => {
            try {
                const { title, name, description, avatar, banner, needed_amount, } = req.body;
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                const createdReward = new models_1.Reward({
                    title,
                    name,
                    description,
                    avatar,
                    banner,
                    needed_amount,
                });
                const reward = await createdReward.save();
                const updatedSystem = await models_1.PointSystem.findByIdAndUpdate(checkIfSystem._id, {
                    $push: {
                        _rewardsIds: reward._id,
                    },
                });
                return res.status(200).json(updatedSystem);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.editReward = async (req, res, next) => {
            try {
                const { title, name, description, avatar, banner, needed_amount, } = req.body;
                const { rewardId } = req.params;
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const reward = await models_1.Reward.findByIdAndUpdate(rewardId, {
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteReward = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { rewardId } = req.params;
                const user = await models_1.User.findById(id).exec();
                const reward = await models_1.Reward.findById(rewardId).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                if (!checkIfSystem) {
                    return res.status(404).json({
                        message: "No system",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                const updatedSystem = await checkIfSystem.update({
                    $pull: {
                        _rewardsIds: reward._id,
                    }
                });
                return res.status(200).json(updatedSystem);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getRequirement = async (req, res, next) => {
            try {
                const { id } = req.params;
                const requirement = await models_1.Requirement.findById(id).exec();
                if (!requirement) {
                    return res.status(404).json({
                        message: "No requirement has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                return res.status(200).json(requirement);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getRequirementsStatus = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const user = await models_1.User.findById(userId).populate({ path: 'cyclist', populate: { path: '_clubId' } }).exec();
                if (user.role === 'cyclist') {
                    const achievedRequirements = await models_1.AchievedRequirement.find({ _userId: userId }).exec();
                    const requirements = await models_1.Requirement.find({ _clubId: user.cyclist._clubId._userId }).exec();
                    let arrayOfRequirements = [];
                    for (let requirement of requirements) {
                        let object = { requirement: requirement, success: false };
                        for (let achieved of achievedRequirements) {
                            if (achieved._requirementId === requirement._id) {
                                object.success = true;
                            }
                            ;
                        }
                        ;
                        arrayOfRequirements.push(object);
                    }
                    ;
                    return res.status(200).json(arrayOfRequirements);
                }
                ;
                return res.status(200).json(false);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createRequirement = async (req, res, next) => {
            try {
                const { title, type, description, goal_distance, goal_duration, goal_days, goal_challenges, goal_goals, goal_events, } = req.body;
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                const newRequirement = new models_1.Requirement({
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.editRequirement = async (req, res, next) => {
            try {
                const { title, type, description, goal_distance, goal_duration, goal_days, goal_challenges, goal_goals, goal_events, } = req.body;
                const { requirementId } = req.params;
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const requirement = await models_1.Requirement.findByIdAndUpdate(requirementId, {
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteRequirement = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { requirementId } = req.params;
                const user = await models_1.User.findById(id).exec();
                const requirement = await models_1.Requirement.findById(requirementId).exec();
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const checkIfSystem = await models_1.PointSystem.findOne({
                    _clubId: id
                }).exec();
                if (!checkIfSystem) {
                    return res.status(404).json({
                        message: "No system",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                const updatedSystem = await checkIfSystem.update({
                    $pull: {
                        _requirementIds: requirement._id,
                    }
                });
                return res.status(200).json(updatedSystem);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.giveManualPoints = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { userId, points, } = req.body;
                if (points > 3) {
                    return res.status(400).json({
                        message: "Max. of 3 points",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                const user = await models_1.User.findById(id).exec();
                const cyclist = await models_1.User.findById(userId).exec();
                let result;
                if (user.role === 'club' || user.role === 'clubmember') {
                    if (cyclist.cyclist.lastManuelPoints === 0) {
                        result = cyclist.update({
                            $set: {
                                'cyclist.pts': cyclist.cyclist.pts + points,
                                'cyclist.lastManualPoints': Date.now(),
                            },
                        });
                    }
                    else {
                        if (moment_1.default(moment_1.default(Date.now())).diff(cyclist.cyclist.lastManuelPoints, 'days') > 7) {
                            result = cyclist.update({
                                $set: {
                                    'cyclist.pts': cyclist.cyclist.pts + points,
                                    'cyclist.lastManualPoints': Date.now(),
                                },
                            });
                        }
                        else {
                            return res.status(400).json({
                                message: "Already added this week",
                                redirect: false,
                                status: 400,
                            });
                        }
                        ;
                    }
                    ;
                }
                else {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                return res.status(200).json(result);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.checkRequirements = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const user = await models_1.User.findById(id).exec();
                if (user.role === "cyclist") {
                    if (user.cyclist._clubId) {
                        const system = await models_1.PointSystem.findOne({ _clubId: user.cyclist._clubId }).exec();
                        if (system) {
                            const activities = await models_1.Activity.find({ _userId: id }).exec();
                            const requirements = await models_1.Requirement.find({ _clubId: user.cyclist._clubId }).exec();
                            for (let requirement of requirements) {
                                for (let activity of activities) {
                                    let distance = 0;
                                    let duration = 0;
                                    let days = 0;
                                    let challenges = 0;
                                    let goals = 0;
                                    let events = 0;
                                    if (moment_1.default(moment_1.default(activity.result.start_date_local).format('YYYY-MM-DD')).isBetween(moment_1.default('2021-01-01'), moment_1.default('2021-12-31'))) {
                                        distance += activity.result.distance;
                                        duration += activity.result.moving_time;
                                        days += 1;
                                    }
                                    ;
                                    const participatedChallenges = await models_1.ChallengeParticipated.find({ _userId: id }).exec();
                                    for (let participation of participatedChallenges) {
                                        if (participation.completed) {
                                            challenges += 1;
                                        }
                                        ;
                                    }
                                    ;
                                    const participatedEvents = await models_1.Event.find().exec();
                                    for (let participation of participatedEvents) {
                                        if (participation.participants.includes(user._id)) {
                                            events += 1;
                                        }
                                        ;
                                    }
                                    ;
                                    const participatedGoals = await models_1.Goal.find({ _cyclistId: user._id, completed: true }).exec();
                                    goals = participatedGoals ? participatedGoals.length : 0;
                                    const succesRequirement = await models_1.AchievedRequirement.findOne({ _requirementId: requirement._id, _userId: user._id }).exec();
                                    if (!succesRequirement) {
                                        if (requirement.type === 'distance') {
                                            let status = false;
                                            if (requirement.goal_distance <= distance) {
                                                status = true;
                                            }
                                            ;
                                            if (moment_1.default.duration(requirement.goal_duration).asSeconds() <= duration) {
                                                status = true;
                                            }
                                            ;
                                            if (requirement.goal_days <= days) {
                                                status = true;
                                            }
                                            ;
                                            if (requirement.goal_challenges <= challenges) {
                                                status = true;
                                            }
                                            ;
                                            if (requirement.goal_goals <= goals) {
                                                status = true;
                                            }
                                            ;
                                            if (requirement.goal_events <= events) {
                                                status = true;
                                            }
                                            ;
                                            if (status) {
                                                const newPopup = new models_1.Popup({
                                                    addedPt: 2,
                                                    previousPt: user.cyclist.pts,
                                                    currentPt: user.cyclist.pts + 2,
                                                    text: `Je hebt een mijlpaal in het puntensysteem "${requirement.title}" voltooid. Daarvoor verkrijg je een aantal punten. Proficiat!`,
                                                    _userId: id,
                                                });
                                                await newPopup.save();
                                                const newSuccessRequirement = new models_1.AchievedRequirement({
                                                    _userId: id,
                                                    _requirementId: requirement.id,
                                                });
                                                await newSuccessRequirement.save();
                                            }
                                            ;
                                        }
                                        ;
                                    }
                                    ;
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
                next();
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.auth = auth;
    }
    ;
}
exports.default = PointsystemController;
;
//# sourceMappingURL=PointsystemController.js.map