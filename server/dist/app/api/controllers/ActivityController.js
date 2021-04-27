"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
class ActivityController {
    constructor(auth) {
        this.showActivity = async (req, res, next) => {
            try {
                // Get id
                const { id } = req.params;
                if (!id)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                const activity = await models_1.Activity.findOne({
                    _id: id
                }).populate('user').exec();
                if (!activity)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(activity);
            }
            catch (e) {
                next();
            }
            ;
        };
        this.deleteActivity = async (req, res, next) => {
            try {
                const activityId = req.params.id;
                if (!activityId)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                const deleted = await models_1.Activity.findByIdAndRemove(activityId).exec();
                if (!deleted)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(deleted);
            }
            catch (e) {
                next();
            }
            ;
        };
        this.editActivity = async (req, res, next) => {
            try {
                const activityId = req.params.id;
                const { object, title, description, type, images, feeling, experience } = req.body;
                if (!activityId)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                const updated = await models_1.Activity.findByIdAndUpdate(activityId, {
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
                if (!updated)
                    return res.status(404).json({
                        message: "No activity has been found",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(updated);
            }
            catch (e) {
                next();
            }
            ;
        };
        this.uploadActivity = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { object, title, description, type, images, feeling, experience } = req.body;
                if (!object)
                    return res.status(404).json({
                        message: "The file hasn't been uploaded correctly",
                        redirect: false,
                        status: 404,
                    });
                let activity;
                if (!images) {
                    let newActivity = new models_1.Activity({
                        title: title,
                        description: description,
                        type: type,
                        activity: object,
                        _userId: id,
                        feeling: feeling,
                        experience: experience,
                    });
                    activity = await newActivity.save();
                    await models_1.User.findByIdAndUpdate(activity._userId, {
                        $push: {
                            'cyclist._activityIds': activity._id,
                        },
                    });
                }
                else {
                    let newActivity = new models_1.Activity({
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
                    await models_1.User.findByIdAndUpdate(activity._userId, {
                        $push: {
                            'cyclist._activityIds': activity._id,
                        },
                    });
                }
                ;
                return res.status(200).json(activity);
            }
            catch (e) {
                next(e);
            }
        };
        this.checkIfEvent = async (req, res, next) => {
            try {
                const { id } = req.params;
                const activity = await models_1.Activity.findById(id).exec();
                const events = await models_1.Event.find().populate({ path: 'participants', populate: { path: '_userId' } }).exec();
                let checkIf = false;
                for (let event of events) {
                    if (event.type === 'Ride' && moment_1.default(activity.result.start_date_local).format('YYYY-MM-DD') === moment_1.default(event.details.date).format('YYYY-MM-DD')) {
                        checkIf = event;
                    }
                    ;
                }
                ;
                return res.status(200).json(checkIf);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createActivity = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { object, title, description, type, images, feeling, experience } = req.body;
                if (!object)
                    return res.status(400).json({
                        message: "The activity hasn't been created correctly",
                        redirect: false,
                        status: 400,
                    });
                let activity;
                if (!images) {
                    let newActivity = new models_1.Activity({
                        title: title,
                        description: description,
                        type: type,
                        activity: object,
                        _userId: id,
                        feeling: feeling,
                        experience: experience,
                    });
                    activity = await newActivity.save();
                    await models_1.User.findByIdAndUpdate(activity._userId, {
                        $push: {
                            'cyclist._activityIds': activity._id,
                        },
                    });
                }
                else {
                    let newActivity = new models_1.Activity({
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
                    await models_1.User.findByIdAndUpdate(activity._userId, {
                        $push: {
                            'cyclist._activityIds': activity._id,
                        },
                    });
                }
                ;
                return res.status(200).json(activity);
            }
            catch (e) {
                next();
            }
            ;
        };
        this.importStravaActivities = async (req, res, next) => {
            try {
                const id = this.auth.checkId(req, res);
                const { activities } = req.body;
                let arrayOfResults = [];
                for (let i = 0; i < activities.length; i++) {
                    const checkIfExist = await models_1.Activity.findOne({ stravaId: activities[i].id }).exec();
                    if (!checkIfExist && activities[i].type === "Ride") {
                        const activity = new models_1.Activity({
                            result: activities[i],
                            stravaId: activities[i].id,
                            _userId: id,
                            _createdAt: activities[i].start_date_local,
                        });
                        const savedActivity = await activity.save();
                        arrayOfResults.push(savedActivity);
                        await models_1.User.findByIdAndUpdate(id, {
                            $push: {
                                'cyclist._activityIds': savedActivity._id,
                            },
                        });
                    }
                    ;
                }
                ;
                return res.status(200).json(arrayOfResults);
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
exports.default = ActivityController;
;
//# sourceMappingURL=ActivityController.js.map