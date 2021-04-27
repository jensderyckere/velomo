"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/nl-be");
class ChallengeController {
    constructor(auth) {
        this.getClubChallenges = async (req, res, next) => {
            try {
                // Find user
                const { userId } = req.params;
                const user = await models_1.User.findById(userId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                // Get challenges from club
                let challenges;
                if (user.role === "cyclist") {
                    challenges = await models_1.Challenge.find({
                        _userId: userId
                    }).populate({
                        path: '_challengeId'
                    }).exec();
                }
                ;
                if (user.role === "club") {
                    challenges = await models_1.User.findById(userId).populate({
                        path: 'club',
                        populate: {
                            path: '_challengeIds'
                        }
                    }).exec();
                }
                ;
                if (!challenges) {
                    return res.status(404).json({
                        message: "No challenges have been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                return res.status(200).json(challenges);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getMyChallenges = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                // Get challenges from myself
                let participatedChallenges = await models_1.ChallengeParticipated.find({
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
                }
                ;
                return res.status(200).json(participatedChallenges);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getCompletedChallenges = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const participatedChallenges = await models_1.ChallengeParticipated.find({
                    _userId: userId,
                    completed: true,
                }).populate({
                    path: '_challengeId'
                }).exec();
                return res.status(200).json(participatedChallenges);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getDetailedChallenge = async (req, res, next) => {
            try {
                // Get challenge
                const { challengeId } = req.params;
                const challenge = await models_1.Challenge.findById(challengeId).populate({
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
                }
                ;
                return res.status(200).json(challenge);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getDetailedParticipation = async (req, res, next) => {
            try {
                // Get challenge participation
                const { challengeId } = req.params;
                // Find user
                const _userId = this.auth.checkId(req, res);
                const participatedChallenge = await models_1.ChallengeParticipated.findOne({
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
                }
                ;
                return res.status(200).json(participatedChallenge);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.createChallenge = async (req, res, next) => {
            try {
                // Find user
                const _userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(_userId).exec();
                // Body
                const { title, shortContent, content, images, video, badge, difficulty, type, distance, start_date, end_date } = req.body;
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (user.role !== 'club') {
                    return res.status(401).json({
                        message: "Unauthorized call",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                // Create challenge
                const createdChallenge = new models_1.Challenge({
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
                await models_1.User.findByIdAndUpdate(_userId, {
                    $push: {
                        'club._challengeIds': savedChallenge._id,
                    },
                });
                for (let i = 0; i < user.club._cyclistIds.length; i++) {
                    const newNotification = new models_1.Notification({
                        _senderId: user._id,
                        _receiverId: user.club._cyclistIds[i],
                        text: `Er is een nieuwe uitdaging beschikbaar genaamd "${savedChallenge.title}"! Bekijk ze snel.`,
                        path: `/challenge/${savedChallenge._id}`,
                    });
                    await newNotification.save();
                }
                ;
                return res.status(200).json(savedChallenge);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        // Edit challenge
        this.editChallenge = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                // Challenge id
                const { challengeId } = req.params;
                const { title, shortContent, content, images, video, badge, difficulty, type, distance, start_date, end_date } = req.body;
                const challenge = await models_1.Challenge.findById(challengeId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (user.role !== 'club' || challenge._userId !== userId) {
                    return res.status(401).json({
                        message: "Unauthorized call",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                const updatedChallenge = await models_1.Challenge.findByIdAndUpdate(challengeId, {
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        // Delete challenge
        this.deleteChallenge = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                // Challenge id
                const { challengeId } = req.params;
                const challenge = await models_1.Challenge.findById(challengeId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (user.role !== 'club' || challenge._userId !== userId) {
                    return res.status(401).json({
                        message: "Unauthorized call",
                        redirect: false,
                        status: 401,
                    });
                }
                ;
                // Delete from participants
                const allParticipatedChallenges = await models_1.ChallengeParticipated.find({
                    _challengeId: challengeId
                }).exec();
                const allUsers = await models_1.User.find({
                    role: "cyclist"
                }).exec();
                for (let i = 0; i < allParticipatedChallenges.length; i++) {
                    for (let j = 0; j < allUsers.length; j++) {
                        if (allUsers[j].cyclist._challengeIds.includes(allParticipatedChallenges[i]._id)) {
                            await models_1.User.findByIdAndUpdate(allUsers[j]._id, {
                                $pull: {
                                    'cyclist._challengeIds': allParticipatedChallenges[i]._id,
                                },
                            }).exec();
                        }
                        ;
                    }
                    ;
                }
                ;
                // Delete from creator
                await models_1.User.findByIdAndUpdate(challenge._userId, {
                    $pull: {
                        'club._challengeIds': challengeId,
                    },
                }).exec();
                // Delete activity
                const deletedChallenge = await models_1.Challenge.findByIdAndDelete(challengeId).exec();
                return res.status(200).json(deletedChallenge);
            }
            catch (e) {
                next(e);
            }
        };
        this.participateChallenge = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                // Body
                const { challengeId } = req.body;
                // Find challenge
                const challenge = await models_1.Challenge.findById(challengeId).exec();
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (challenge.participants.includes(userId)) {
                    return res.status(404).json({
                        message: "User already participating",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                await models_1.Challenge.findByIdAndUpdate(challengeId, {
                    $push: {
                        participants: userId,
                    }
                });
                // Create participation
                const participatedChallenge = new models_1.ChallengeParticipated({
                    _userId: userId,
                    _challengeId: challengeId,
                });
                const createdParticipation = await participatedChallenge.save();
                await models_1.User.findByIdAndUpdate(userId, {
                    $push: {
                        'cyclist._challengeIds': createdParticipation._id,
                    },
                });
                return res.status(200).json(createdParticipation);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        // Withdraw from challenge
        this.withdrawChallenge = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                // Body
                const { challengeId } = req.body;
                // Find challenge
                const challenge = await models_1.Challenge.findById(challengeId).exec();
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!challenge.participants.includes(userId)) {
                    return res.status(404).json({
                        message: "User isn't participating",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                await models_1.Challenge.findByIdAndUpdate(challengeId, {
                    $pull: {
                        participants: user._id,
                    },
                }).exec();
                // Delete participated challenge
                const participatedChallenge = await models_1.ChallengeParticipated.findOne({
                    _userId: userId,
                    _challengeId: challenge._id
                }).exec();
                await models_1.User.findByIdAndUpdate(userId, {
                    $pull: {
                        'cyclist._challengeIds': participatedChallenge._id,
                    },
                }).exec();
                const deletedChallenge = await models_1.ChallengeParticipated.findByIdAndDelete(participatedChallenge._id);
                return res.status(200).json(deletedChallenge);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.viewRandomDashboardChallenge = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!user.cyclist._challengeIds) {
                    return res.status(404).json({
                        message: "No challenges have been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                let arrayOfChallenges = [];
                const challenges = await models_1.Challenge.find().populate({
                    path: '_userId'
                }).exec();
                for (let i = 0; i < challenges.length; i++) {
                    if (challenges[i].participants.includes(userId)) {
                        arrayOfChallenges.push(challenges[i]);
                    }
                    ;
                }
                ;
                const randomDigit = Math.floor(Math.random() * arrayOfChallenges.length);
                const challenge = arrayOfChallenges[randomDigit];
                const participants = challenge.participants;
                let arrayOfParticipants = [];
                if (challenge.type === 'image' || challenge.type === 'video' || challenge.type === 'activity') {
                    const result = await models_1.Challenge.findById(challenge._id).populate({
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
                }
                ;
                if (challenge.type === 'distance') {
                    // Calculate distances between dates
                    for (let i = 0; i < participants.length; i++) {
                        const user = await models_1.User.findById(participants[i])
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
                            if (user.cyclist._activityIds[j].result) {
                                const totalDistance = user.cyclist._activityIds[j].result.distance / 1000;
                                // Check if between dates
                                if (moment_1.default(user.cyclist._activityIds[j].result.start_date_local).isBetween(challenge.start_date, challenge.end_date)) {
                                    distance = distance + totalDistance;
                                }
                                ;
                            }
                            ;
                        }
                        ;
                        const object = {
                            user: user,
                            distance: distance
                        };
                        arrayOfParticipants.push(object);
                        if (distance >= challenge.distance) {
                            await models_1.ChallengeParticipated.findOneAndUpdate({
                                _userId: user._id,
                                _challengeId: challenge._id
                            }, {
                                completed: true,
                                seen: false,
                            }).exec();
                            // const newPopup : IPopup = new Popup({
                            //   addedPt: 2,
                            //   previousPt: user.cyclist.pts,
                            //   currentPt: user.cyclist.pts + 2,
                            //   text: `Je hebt de uitdaging "${challenge.title}" voltooid. Daarvoor verkrijg je een aantal punten en een badge. Proficiat!`,
                            //   _userId: userId,
                            // });
                            // await newPopup.save();
                        }
                        ;
                    }
                    ;
                }
                ;
                if (challenge.type === 'duration') {
                    // Calculate distances between dates
                    for (let i = 0; i < participants.length; i++) {
                        const user = await models_1.User.findById(participants[i])
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
                        let duration = moment_1.default.duration('00:00:00');
                        for (let j = 0; j < user.cyclist._activityIds.length; j++) {
                            if (user.cyclist._activityIds[i].result) {
                                const totalDuration = user.cyclist._activityIds[i].result.moving_time;
                                // Check if between dates
                                if (moment_1.default(user.cyclist._activityIds[j].result.start_date_local).isBetween(challenge.start_date, challenge.end_date)) {
                                    duration = moment_1.default.duration(duration).add(moment_1.default.duration(totalDuration));
                                }
                                ;
                            }
                            ;
                        }
                        ;
                        const object = {
                            user: user,
                            duration: duration
                        };
                        arrayOfParticipants.push(object);
                        if (duration.asMilliseconds() >= moment_1.default.duration(challenge.duration).asMilliseconds()) {
                            await models_1.ChallengeParticipated.findOneAndUpdate({
                                _userId: user._id,
                                _challengeId: challenge._id
                            }, {
                                completed: true,
                                seen: false,
                            }).exec();
                            // const newPopup : IPopup = new Popup({
                            //   addedPt: 2,
                            //   previousPt: user.cyclist.pts,
                            //   currentPt: user.cyclist.pts + 2,
                            //   text: `Je hebt de uitdaging "${challenge.title}" voltooid. Daarvoor verkrijg je een aantal punten en een badge. Proficiat!`,
                            //   _userId: userId,
                            // });
                            // await newPopup.save();
                        }
                        ;
                    }
                    ;
                }
                ;
                return res.status(200).json({
                    challenge: challenge,
                    participants: arrayOfParticipants,
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.viewParticipantMonthlyCharts = async (req, res, next) => {
            try {
                // Params
                const { challengeId } = req.params;
                // Variables
                let arrayOfParticipants = [];
                const challenge = await models_1.Challenge.findById(challengeId).exec();
                const participants = challenge.participants;
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (challenge.type === 'image' || challenge.type === 'video') {
                    return res.status(400).json({
                        message: "Incorrect usage",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                if (challenge.type === 'distance') {
                    // Calculate distances between dates
                    for (let i = 0; i < participants.length; i++) {
                        const user = await models_1.User.findById(participants[i])
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
                            if (user.cyclist._activityIds[j].result) {
                                const totalDistance = user.cyclist._activityIds[j].result.distance / 1000;
                                // Check if between dates
                                if (moment_1.default(user.cyclist._activityIds[j].result.start_date_local).isBetween(challenge.start_date, challenge.end_date)) {
                                    distance = distance + totalDistance;
                                }
                                ;
                            }
                            ;
                        }
                        ;
                        const object = {
                            user: user,
                            distance: distance
                        };
                        arrayOfParticipants.push(object);
                        if (distance >= challenge.distance) {
                            await models_1.ChallengeParticipated.findOneAndUpdate({
                                _userId: user._id,
                                _challengeId: challenge._id
                            }, {
                                completed: true,
                                seen: false,
                            }).exec();
                        }
                        ;
                    }
                    ;
                }
                ;
                if (challenge.type === 'duration') {
                    // Calculate distances between dates
                    for (let i = 0; i < participants.length; i++) {
                        const user = await models_1.User.findById(participants[i])
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
                        let duration = moment_1.default.duration('00:00:00');
                        for (let j = 0; j < user.cyclist._activityIds.length; j++) {
                            if (user.cyclist._activityIds[i].result) {
                                const totalDuration = user.cyclist._activityIds[i].result.moving_time;
                                // Check if between dates
                                if (moment_1.default(user.cyclist._activityIds[j].moving_time.start_date_local).isBetween(challenge.start_date, challenge.end_date)) {
                                    duration = moment_1.default.duration(duration).add(moment_1.default.duration(totalDuration));
                                }
                                ;
                            }
                            ;
                        }
                        ;
                        const object = {
                            user: user,
                            duration: duration
                        };
                        arrayOfParticipants.push(object);
                        if (duration.asMilliseconds() >= moment_1.default.duration(challenge.duration).asMilliseconds()) {
                            await models_1.ChallengeParticipated.findOneAndUpdate({
                                _userId: user._id,
                                _challengeId: challenge._id
                            }, {
                                completed: true,
                                seen: false,
                            }).exec();
                        }
                        ;
                    }
                    ;
                }
                ;
                return res.status(200).json(arrayOfParticipants);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        // Submit submission
        this.submitSubmission = async (req, res, next) => {
            try {
                // Find user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                // Challenge id
                const { challengeId } = req.params;
                const challenge = await models_1.Challenge.findById(challengeId).populate({
                    path: 'submissions'
                }).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                // Create submission
                const { text, image, video, activity, _userId } = req.body;
                // Check if already submitted
                for (let i = 0; i < challenge.submissions.length; i++) {
                    if (challenge.submissions[i]._userId === _userId) {
                        return res.status(400).json({
                            message: "User has already submitted",
                            redirect: false,
                            status: 400,
                        });
                    }
                    ;
                }
                ;
                if (challenge.participants.includes(userId)) {
                    return res.status(404).json({
                        message: "User already participating",
                        redirect: false,
                        status: 400,
                    });
                }
                ;
                await models_1.Challenge.findByIdAndUpdate(challengeId, {
                    $push: {
                        participants: userId,
                    }
                });
                // Create participation
                const participatedChallenge = new models_1.ChallengeParticipated({
                    _userId: userId,
                    _challengeId: challengeId,
                });
                const createdParticipation = await participatedChallenge.save();
                await models_1.User.findByIdAndUpdate(userId, {
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
                const createdSubmission = new models_1.Submission(object);
                const savedSubmission = await createdSubmission.save();
                const updatedChallenge = await models_1.Challenge.findByIdAndUpdate(challengeId, {
                    $set: {
                        submissions: savedSubmission._id,
                    }
                }).exec();
                return res.status(200).json(updatedChallenge);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        // Approve submission
        this.approveSubmission = async (req, res, next) => {
            try {
                // Check if params exist
                const { challengeId, userId } = req.params;
                const challenge = await models_1.Challenge.findById(challengeId).populate({ path: 'submissions' }).exec();
                const user = await models_1.User.findById(userId).exec();
                const clubId = this.auth.checkId(req, res);
                const club = await models_1.User.findById(clubId).exec();
                if (!user) {
                    return res.status(404).json({
                        message: "No user has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                if (!challenge) {
                    return res.status(404).json({
                        message: "No challenge has been found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                for (let i = 0; i < challenge.submissions.length; i++) {
                    if (String(challenge.submissions[i]._userId) === String(userId)) {
                        // Find submission
                        await models_1.Submission.findOneAndUpdate({ _id: challenge.submissions[i].id }, {
                            $set: {
                                approved: true,
                            },
                        });
                    }
                    ;
                }
                ;
                // Find participation model
                const participation = await models_1.ChallengeParticipated.findOne({
                    _userId: userId,
                    _challengeId: challengeId
                });
                if (!participation) {
                    return res.status(404).json({
                        message: "No participation",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                const updatedParticipation = await participation.update({
                    completed: true,
                    seen: false,
                });
                const newPopup = new models_1.Popup({
                    addedPt: 2,
                    previousPt: user.cyclist.pts,
                    currentPt: user.cyclist.pts + 2,
                    text: `Je hebt de uitdaging "${challenge.title}" voltooid. Daarvoor verkrijg je een aantal punten en een badge. Proficiat!`,
                    _userId: userId,
                });
                await newPopup.save();
                const newNotification = new models_1.Notification({
                    _senderId: club._id,
                    _receiverId: user._id,
                    text: `Jouw inzending in "${challenge.title}" is goedgekeurd. Weer een badge erbij!`,
                    path: `/challenge/${challenge._id}`,
                });
                await newNotification.save();
                return res.status(200).json(updatedParticipation);
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
exports.default = ChallengeController;
;
//# sourceMappingURL=ChallengeController.js.map