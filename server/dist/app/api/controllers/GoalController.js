"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/nl-be");
class GoalController {
    constructor(auth) {
        this.showGoal = async (req, res, next) => {
            try {
                const { goalId } = req.params;
                // Find all goals
                const goals = await models_1.Goal.find({
                    _id: goalId
                }).populate({
                    path: '_cyclistId'
                }).populate({
                    path: '_creatorId'
                }).sort({
                    _createdAt: -1
                }).exec();
                if (!goals)
                    return res.status(200).json([]);
                return res.status(200).json(goals);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.showUserGoals = async (req, res, next) => {
            try {
                const { userId } = req.params;
                // Find all goals
                const goals = await models_1.Goal.find({
                    _cyclistId: userId
                }).populate({
                    path: '_cyclistId'
                }).populate({
                    path: '_creatorId'
                }).sort({
                    _createdAt: -1
                }).exec();
                if (!goals)
                    return res.status(200).json([]);
                return res.status(200).json(goals);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getCompletedGoals = async (req, res, next) => {
            try {
                const { userId } = req.params;
                // Find all goals
                const goals = await models_1.Goal.find({
                    _cyclistId: userId,
                    completed: true,
                }).populate({
                    path: '_cyclistId'
                }).populate({
                    path: '_creatorId'
                }).sort({
                    _createdAt: -1
                }).exec();
                if (!goals)
                    return res.status(200).json([]);
                return res.status(200).json(goals);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.showCreatorGoals = async (req, res, next) => {
            try {
                const { userId } = req.params;
                // Find all goals
                const goals = await models_1.Goal.find({
                    _creatorId: userId
                }).populate({
                    path: '_cyclistId'
                }).populate({
                    path: '_creatorId'
                }).sort({
                    _createdAt: -1
                }).exec();
                if (!goals)
                    return res.status(200).json([]);
                return res.status(200).json(goals);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createGoal = async (req, res, next) => {
            try {
                const _creatorId = this.auth.checkId(req, res);
                const { title, description, type, goal, badge, start_date, end_date, _cyclistId } = req.body;
                const createdGoal = new models_1.Goal({
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.editGoal = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { title, description, type, goal, badge, start_date, end_date } = req.body;
                const updatedGoal = await models_1.Goal.findByIdAndUpdate(id, {
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteGoal = async (req, res, next) => {
            try {
                const { id } = req.params;
                const deletedGoal = await models_1.Goal.findByIdAndDelete(id).exec();
                return res.status(200).json(deletedGoal);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.showGoalStats = async (req, res, next) => {
            try {
                const { userId, goalId } = req.params;
                const user = await models_1.User.findById(userId).populate({
                    path: 'cyclist',
                    populate: {
                        path: '_activityIds'
                    }
                }).exec();
                const goal = await models_1.Goal.findById(goalId).exec();
                if (!goal || !user) {
                    return res.status(404).json({
                        message: 'Not found',
                        status: 404,
                        redirect: false,
                    });
                }
                ;
                let maxRide = 0;
                let totalDistance = 0;
                for (let i = 0; i < user.cyclist._activityIds.length; i++) {
                    if (moment_1.default(user.cyclist._activityIds[i].result.starting_time_local).isBetween(goal.start_date, goal.end_date)) {
                        if (user.cyclist._activityIds[i].result) {
                            if ((user.cyclist._activityIds[i].result.distance / 1000) > maxRide) {
                                maxRide = user.cyclist._activityIds[i].result.distance;
                            }
                            ;
                            totalDistance = totalDistance + (user.cyclist._activityIds[i].result.distance / 1000);
                        }
                        ;
                    }
                    ;
                }
                ;
                return res.status(200).json({
                    progress: goal.type === 'ride' ? maxRide : totalDistance,
                    goal: goal.goal,
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.checkGoals = async (req, res, next) => {
            try {
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                if (user.role === 'cyclist') {
                    const details = await models_1.User.findById(userId).populate({
                        path: 'cyclist',
                        populate: {
                            path: '_activityIds'
                        }
                    }).exec();
                    const goals = await models_1.Goal.find({
                        _cyclistId: userId
                    }).exec();
                    for (let i = 0; i < goals.length; i++) {
                        if (goals[i].completed === false) {
                            // Check if between dates
                            for (let j = 0; j < details.cyclist._activityIds.length; j++) {
                                let distance = 0;
                                if (details.cyclist._activityIds[j].result) {
                                    if (moment_1.default(details.cyclist._activityIds[j].result.starting_time_local).isBetween(goals[i].start_date, goals[i].end_date)) {
                                        if (goals[i].type === 'ride') {
                                            if ((details.cyclist._activityIds[j].result.distance / 1000) >= goals[i].goal) {
                                                await models_1.Goal.findByIdAndUpdate(goals[i]._id, {
                                                    $set: {
                                                        completed: true,
                                                        _completedAt: String(Date.now()),
                                                    },
                                                });
                                                const newPopup = new models_1.Popup({
                                                    addedPt: 2,
                                                    previousPt: user.cyclist.pts,
                                                    currentPt: user.cyclist.pts + 2,
                                                    text: `Je hebt de doelstelling "${goals[i].title}" voltooid. Daarvoor verkrijg je een aantal punten en een badge. Proficiat!`,
                                                    _userId: userId,
                                                });
                                                await newPopup.save();
                                            }
                                            ;
                                        }
                                        ;
                                        if (goals[i].type === 'month' || goals[i].type === 'year') {
                                            distance = distance + (details.cyclist._activityIds[j].result.distance / 1000);
                                            if (distance >= goals[i].goal) {
                                                await models_1.Goal.findByIdAndUpdate(goals[i]._id, {
                                                    $set: {
                                                        completed: true,
                                                        _completedAt: String(Date.now()),
                                                    },
                                                });
                                                const newPopup = new models_1.Popup({
                                                    addedPt: 2,
                                                    previousPt: user.cyclist.pts,
                                                    currentPt: user.cyclist.pts + 2,
                                                    text: `Je hebt de doelstelling "${goals[i].title}" voltooid. Daarvoor verkrijg je een aantal punten en een badge. Proficiat!`,
                                                    _userId: userId,
                                                });
                                                await newPopup.save();
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
exports.default = GoalController;
;
//# sourceMappingURL=GoalController.js.map