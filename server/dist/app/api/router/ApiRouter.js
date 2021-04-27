"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importStar(require("multer"));
const services_1 = require("../../services");
const controllers_1 = require("../controllers");
class ApiRouter {
    constructor(config, auth) {
        this.config = config;
        this.auth = auth;
        this.router = express_1.default.Router();
        this.initControllers();
        this.initRoutes();
    }
    ;
    initControllers() {
        this.userController = new controllers_1.UserController(this.auth, this.config);
        this.resetController = new controllers_1.ResetController(this.config);
        this.pictureController = new controllers_1.PictureController();
        this.videoController = new controllers_1.VideoController();
        this.activityController = new controllers_1.ActivityController(this.auth);
        this.challengeController = new controllers_1.ChallengeController(this.auth);
        this.popupController = new controllers_1.PopupController(this.auth);
        this.notificationController = new controllers_1.NotificationController(this.auth);
        this.goalController = new controllers_1.GoalController(this.auth);
        this.commentController = new controllers_1.CommentController(this.auth);
        this.eventController = new controllers_1.EventController(this.auth);
        this.pointsystemController = new controllers_1.PointsystemController(this.auth);
    }
    ;
    initRoutes() {
        // Landing
        this.router.get('/landing-stats', this.userController.getLandingStats);
        // User
        this.router.get('/users', this.userController.checkAdmin, this.userController.all);
        this.router.get('/users-charts/:userId', this.userController.checkToken, this.userController.getCharts);
        this.router.get('/users/:userId', this.userController.checkToken, this.userController.show);
        this.router.get('/current-user', this.userController.checkToken, this.goalController.checkGoals, this.pointsystemController.checkRequirements, this.userController.current);
        this.router.get('/user-via-id/:id/:type', this.userController.checkToken, this.userController.showViaId);
        this.router.patch('/users/profile', this.userController.checkToken, this.userController.updateProfile);
        this.router.patch('/users/settings', this.userController.checkToken, this.userController.updateSettings);
        this.router.patch('/users/password', this.userController.checkToken, this.userController.updatePassword);
        this.router.patch('/users/connections', this.userController.checkToken, this.userController.connectUsers);
        this.router.patch('/users/disconnect', this.userController.checkToken, this.userController.disconnectUsers);
        this.router.patch('/users/add-points', this.userController.checkToken, this.userController.addPoints);
        // Authentication
        this.router.post('/login', this.userController.login);
        this.router.post('/register/first-check', this.userController.firstCheck);
        this.router.post('/register', this.userController.register);
        // Storage
        this.router.get('/picture/:avatar', this.pictureController.showAvatar);
        this.router.get('/video/:video', this.videoController.showVideo);
        this.router.post('/picture/upload', multer_1.default({
            storage: multer_1.memoryStorage()
        }).single('picture'), services_1.Storage.uploadAvatar, this.pictureController.uploadAvatar);
        this.router.post('/video/upload', multer_1.default({
            storage: multer_1.memoryStorage()
        }).single('video'), services_1.Storage.uploadVideo, this.videoController.uploadVideo);
        // Activity
        this.router.get('/activity/:id', this.userController.checkToken, this.activityController.showActivity);
        this.router.get('/if-event/:id', this.userController.checkToken, this.activityController.checkIfEvent);
        this.router.post('/strava-activities', this.userController.checkToken, this.activityController.importStravaActivities);
        this.router.post('/upload-activity', this.userController.checkToken, multer_1.default({
            storage: multer_1.memoryStorage()
        }).single('gpxFile'), services_1.Storage.uploadGPX, this.activityController.uploadActivity);
        this.router.post('/manual-activity', this.userController.checkToken, this.activityController.createActivity);
        this.router.patch('/activity/:id', this.userController.checkToken, this.activityController.editActivity);
        this.router.delete('/activity/:id', this.userController.checkToken, this.activityController.deleteActivity);
        // Challenges
        this.router.get('/random-challenge', this.userController.checkToken, this.challengeController.viewRandomDashboardChallenge);
        this.router.get('/club-challenges/:userId', this.userController.checkToken, this.challengeController.getClubChallenges);
        this.router.get('/my-challenges', this.userController.checkToken, this.challengeController.getMyChallenges);
        this.router.get('/completed-challenges/:userId', this.userController.checkToken, this.challengeController.getCompletedChallenges);
        this.router.get('/challenge/:challengeId', this.userController.checkToken, this.challengeController.getDetailedChallenge);
        this.router.get('/participation/:challengeId', this.userController.checkToken, this.challengeController.getDetailedParticipation);
        this.router.post('/challenge', this.userController.checkToken, this.challengeController.createChallenge);
        this.router.patch('/challenge/:challengeId', this.userController.checkToken, this.challengeController.editChallenge);
        this.router.delete('/challenge/:challengeId', this.userController.checkToken, this.challengeController.deleteChallenge);
        this.router.post('/participate-challenge', this.userController.checkToken, this.challengeController.participateChallenge);
        this.router.post('/withdraw-challenge', this.userController.checkToken, this.challengeController.withdrawChallenge);
        this.router.get('/participation-monthly-charts/:challengeId', this.userController.checkToken, this.challengeController.viewParticipantMonthlyCharts);
        this.router.post('/submit-submission/:challengeId', this.userController.checkToken, this.challengeController.submitSubmission);
        this.router.post('/approve-submission/:challengeId/:userId', this.userController.checkToken, this.challengeController.approveSubmission);
        // Popups
        this.router.get('/popups', this.userController.checkToken, this.popupController.viewAllPopups);
        this.router.get('/popups/viewed/:id', this.userController.checkToken, this.popupController.viewedPopup);
        // Notifications
        this.router.get('/notifications', this.userController.checkToken, this.notificationController.getNotifications);
        this.router.get('/notifications/:id', this.userController.checkToken, this.notificationController.viewNotification);
        // Goals
        this.router.get('/user-goals/:userId', this.userController.checkToken, this.goalController.showUserGoals);
        this.router.get('/creator-goals/:userId', this.userController.checkToken, this.goalController.showCreatorGoals);
        this.router.get('/completed-goals/:userId', this.userController.checkToken, this.goalController.getCompletedGoals);
        this.router.get('/goals/:goalId', this.userController.checkToken, this.goalController.showGoal);
        this.router.get('/goals-progress/:userId/:goalId', this.userController.checkToken, this.goalController.showGoalStats);
        this.router.post('/goals', this.userController.checkToken, this.goalController.createGoal);
        this.router.patch('/goals/:id', this.userController.checkToken, this.goalController.editGoal);
        this.router.delete('/goals/:id', this.userController.checkToken, this.goalController.deleteGoal);
        // Comments
        this.router.get('/comments/:eventId', this.userController.checkToken, this.commentController.getComments);
        this.router.post('/comments/:eventId', this.userController.checkToken, this.commentController.createComment);
        this.router.patch('/comments/:commentId', this.userController.checkToken, this.commentController.editComment);
        this.router.delete('/comments/:commentId', this.userController.checkToken, this.commentController.deleteComment);
        // Events
        this.router.get('/events', this.userController.checkToken, this.eventController.getEvents);
        this.router.get('/event/:eventId', this.userController.checkToken, this.eventController.getEvent);
        this.router.get('/participated-events', this.userController.checkToken, this.eventController.getParticipatedEvents);
        this.router.post('/event', this.userController.checkToken, this.eventController.createEvent);
        this.router.patch('/event/:eventId', this.userController.checkToken, this.eventController.updateEvent);
        this.router.delete('/event/:eventId', this.userController.checkToken, this.eventController.deleteEvent);
        this.router.post('/participate-event/:eventId', this.userController.checkToken, this.eventController.participateEvent);
        this.router.post('/withdraw-event/:eventId', this.userController.checkToken, this.eventController.withdrawEvent);
        this.router.post('/approve-presence/:eventId/:userId', this.userController.checkToken, this.eventController.approvePresence);
        // Pointsystem
        this.router.get('/system/:clubId', this.userController.checkToken, this.pointsystemController.getSystem);
        this.router.get('/reward/:id', this.userController.checkToken, this.pointsystemController.getReward);
        this.router.get('/requirement/:id', this.userController.checkToken, this.pointsystemController.getRequirement);
        this.router.get('/requirement-stats/:userId', this.userController.checkToken, this.pointsystemController.getRequirementsStatus);
        this.router.post('/give-points', this.userController.checkToken, this.pointsystemController.giveManualPoints);
        this.router.post('/system', this.userController.checkToken, this.pointsystemController.createSystem);
        this.router.post('/reward', this.userController.checkToken, this.pointsystemController.createReward);
        this.router.post('/requirement', this.userController.checkToken, this.pointsystemController.createRequirement);
        this.router.patch('/reward/:rewardId', this.userController.checkToken, this.pointsystemController.editReward);
        this.router.patch('/requirement/:requirementId', this.userController.checkToken, this.pointsystemController.editRequirement);
        this.router.delete('/system', this.userController.checkToken, this.pointsystemController.deleteSystem);
        this.router.delete('/reward/:rewardId', this.userController.checkToken, this.pointsystemController.deleteReward);
        this.router.delete('/requirement/:requirementId', this.userController.checkToken, this.pointsystemController.deleteRequirement);
        // Reset
        this.router.post('/reset', this.resetController.send);
        this.router.post('/reset/submit', this.resetController.submit);
    }
    ;
}
exports.default = ApiRouter;
;
//# sourceMappingURL=ApiRouter.js.map