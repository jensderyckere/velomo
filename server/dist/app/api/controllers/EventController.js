"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class EventController {
    constructor(auth) {
        this.getEvents = async (req, res, next) => {
            try {
                const userId = this.auth.checkId(req, res);
                // Filter events
                const events = await models_1.Event.find().populate({
                    path: '_creatorId'
                }).sort({
                    'details.date': -1
                }).exec();
                let arrayOfEvents = [];
                let user = await models_1.User.findById(userId).exec();
                if (user.role === 'cyclist') {
                    user = await models_1.User.findById(userId).populate({
                        path: 'cyclist',
                        populate: {
                            path: '_clubId'
                        }
                    });
                    for (let event of events) {
                        if (String(event._creatorId._id) === String(user._id)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                        if (event._creatorId.role === 'cyclist' && String(event._creatorId.cyclist._clubId._userId) === String(user.cyclist._clubId._userId)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                        if (event._creatorId.role === 'clubmember' && String(event._creatorId.member._clubId._userId) === String(user.cyclist._clubId._userId)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                        if (event._creatorId.role === 'club' && String(event._creatorId._id) === String(user.cyclist._clubId._userId)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                    }
                    ;
                }
                ;
                if (user.role === 'club') {
                    user = await models_1.User.findById(userId).populate({
                        path: 'club',
                        populate: {
                            path: '_cyclistIds'
                        }
                    }).populate({
                        path: 'club',
                        populate: {
                            path: '_memberIds'
                        }
                    });
                    const clubCyclist = user.club._cyclistIds;
                    const clubMembers = user.club._memberIds;
                    for (let event of events) {
                        if (String(event._creatorId._id) === String(userId)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                        for (let cyclist of clubCyclist) {
                            if (String(event._creatorId._id) === String(cyclist._userId)) {
                                arrayOfEvents.push(event);
                            }
                            ;
                        }
                        ;
                        for (let member of clubMembers) {
                            if (String(event._creatorId._id) === String(member._userId)) {
                                arrayOfEvents.push(event);
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
                if (user.role === 'clubmember') {
                    const clubId = await models_1.Club.findById(user.member._clubId).exec();
                    const club = await models_1.User.findById(clubId._userId).exec();
                    for (let event of events) {
                        if (String(event._creatorId._id) === String(club._id)) {
                            arrayOfEvents.push(event);
                        }
                        ;
                        for (let cyclist of club.club._cyclistIds) {
                            const detailedCyclist = await models_1.Cyclist.findById(cyclist).exec();
                            if (String(event._creatorId._id) === String(detailedCyclist._userId)) {
                                arrayOfEvents.push(event);
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
                if (user.role === 'parent') {
                    user = await models_1.User.findById(userId).populate({
                        path: 'parent',
                        populate: {
                            path: '_cyclistIds'
                        }
                    });
                    let arrayOfKidsEvents = [];
                    for (let kid of user.parent._cyclistIds) {
                        let arrayOfKidEvents = [];
                        const detailedKid = await models_1.User.findById(kid._userId).exec();
                        for (let event of events) {
                            for (let participant of event.participants) {
                                if (String(participant._userId) === String(kid._userId)) {
                                    arrayOfKidEvents.push(event);
                                }
                                ;
                            }
                        }
                        ;
                        arrayOfKidsEvents.push({
                            user: detailedKid,
                            events: arrayOfKidEvents
                        });
                    }
                    ;
                    arrayOfEvents = arrayOfKidsEvents;
                }
                ;
                return res.status(200).json(arrayOfEvents);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getParticipatedEvents = async (req, res, next) => {
            try {
                const userId = this.auth.checkId(req, res);
                let result = [];
                const events = await models_1.Event.find().sort({
                    _createdAt: -1
                }).exec();
                for (let i = 0; i < events.length; i++) {
                    for (let participant of events[i].participants) {
                        if (String(participant._userId) === String(userId)) {
                            result.push(events[i]);
                        }
                        ;
                    }
                    ;
                }
                ;
                return res.status(200).json(result);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getEvent = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const event = await models_1.Event.findById(eventId).populate({
                    path: 'participants',
                    populate: {
                        path: '_userId',
                    }
                }).populate({
                    path: '_creatorId'
                }).exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(event);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createEvent = async (req, res, next) => {
            try {
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                const { title, description, details, gpxFile, type } = req.body;
                let result;
                if (user.role === 'cyclist') {
                    const newEvent = new models_1.Event({
                        title: title,
                        description: description,
                        details: details,
                        gpxFile: gpxFile || null,
                        type: 'Ride',
                        _creatorId: userId,
                    });
                    result = await newEvent.save();
                }
                ;
                if (user.role === 'club' || user.role === 'clubmember') {
                    const newEvent = new models_1.Event({
                        title: title,
                        description: description,
                        details: details,
                        gpxFile: gpxFile || null,
                        type: type,
                        _creatorId: userId,
                    });
                    result = await newEvent.save();
                }
                ;
                if (user.role === 'parent') {
                    return res.status(401).json({
                        message: "You can't create an event",
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
        this.updateEvent = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const { title, description, details, gpxFile, type } = req.body;
                const userId = this.auth.checkId(req, res);
                const event = await models_1.Event.findById(eventId).exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                if (String(event._creatorId) !== String(userId))
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                const updatedEvent = await models_1.Event.findByIdAndUpdate(eventId, {
                    $set: {
                        title: title,
                        description: description,
                        details: details,
                        gpxFile: gpxFile || null,
                        type: type,
                    },
                }).exec();
                return res.status(200).json(updatedEvent);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.deleteEvent = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const userId = this.auth.checkId(req, res);
                const event = await models_1.Event.findById(eventId).exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                if (event._creatorId !== userId)
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                const deletedEvent = await models_1.Event.findByIdAndDelete(eventId).exec();
                return res.status(200).json(deletedEvent);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.participateEvent = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const userId = this.auth.checkId(req, res);
                const event = await models_1.Event.findById(eventId)
                    .exec();
                console.log(event);
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                for (let participant of event.participants) {
                    if (String(participant._userId._id === String(userId))) {
                        return res.status(400).json({
                            message: "Already participating",
                            redirect: false,
                            status: 400,
                        });
                    }
                    ;
                }
                ;
                const updatedEvent = await models_1.Event.findByIdAndUpdate(eventId, {
                    $push: {
                        participants: {
                            _userId: userId,
                            present: false,
                        },
                    },
                }).exec();
                return res.status(200).json(updatedEvent);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.withdrawEvent = async (req, res, next) => {
            try {
                const { eventId } = req.params;
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                const event = await models_1.Event.findById(eventId)
                    .exec();
                if (!event)
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                const updatedEvent = await models_1.Event.findByIdAndUpdate(eventId, {
                    $pull: {
                        participants: {
                            _userId: user._id,
                        },
                    },
                }).exec();
                return res.status(200).json(updatedEvent);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.approvePresence = async (req, res, next) => {
            try {
                const { eventId, userId, } = req.params;
                const creatorId = this.auth.checkId(req, res);
                const event = await models_1.Event.findById(eventId)
                    .exec();
                if (!event) {
                    return res.status(404).json({
                        message: "No event has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (String(creatorId) !== String(event._creatorId)) {
                    return res.status(401).json({
                        message: "Unauthorized",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const updatedEvent = await models_1.Event.findOneAndUpdate({
                    _id: eventId,
                    'participants._userId': userId
                }, {
                    $set: {
                        'participants.$.present': true,
                    }
                }).exec();
                return res.status(400).json(updatedEvent);
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
exports.default = EventController;
;
//# sourceMappingURL=EventController.js.map