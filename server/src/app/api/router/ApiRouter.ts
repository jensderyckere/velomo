import {
    default as express,
    Router
} from "express";

import {
    default as multer,
    memoryStorage
} from "multer";

import {
    Auth,
    IConfig,
    Storage
} from "../../services";

import {
    PictureController,
    ResetController,
    PopupController,
    UserController,
    ActivityController,
    ChallengeController,
    VideoController,
    NotificationController,
    GoalController,
    CommentController,
    EventController,
} from "../controllers";

export default class ApiRouter {
    public router: Router;
    private config: IConfig;
    private auth: Auth;

    private userController: UserController;
    private resetController: ResetController;
    private pictureController: PictureController;
    private activityController: ActivityController;
    private challengeController: ChallengeController;
    private videoController: VideoController;
    private popupController: PopupController;
    private notificationController: NotificationController;
    private goalController: GoalController;
    private commentController: CommentController;
    private eventController: EventController;

    constructor(config: IConfig, auth: Auth) {
        this.config = config;
        this.auth = auth;

        this.router = express.Router();

        this.initControllers();
        this.initRoutes();
    };

    private initControllers(): void {
        this.userController = new UserController(this.auth, this.config);
        this.resetController = new ResetController(this.config);
        this.pictureController = new PictureController();
        this.videoController = new VideoController();
        this.activityController = new ActivityController(this.auth);
        this.challengeController = new ChallengeController(this.auth);
        this.popupController = new PopupController(this.auth);
        this.notificationController = new NotificationController(this.auth);
        this.goalController = new GoalController(this.auth);
        this.commentController = new CommentController(this.auth);
        this.eventController = new EventController(this.auth);
    };

    private initRoutes(): void {
        // User
        this.router.get('/users', this.userController.checkAdmin, this.userController.all);
        this.router.get('/users-charts/:userId', this.userController.checkToken, this.userController.getCharts);
        this.router.get('/users/:userId', this.userController.checkToken, this.userController.show);
        this.router.get('/current-user', this.userController.checkToken, this.goalController.checkGoals, this.userController.current);
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
        this.router.post('/picture/upload', multer({
            storage: memoryStorage()
        }).single('picture'), Storage.uploadAvatar, this.pictureController.uploadAvatar);
        this.router.post('/video/upload', multer({
            storage: memoryStorage()
        }).single('video'), Storage.uploadVideo, this.videoController.uploadVideo);

        // Activity
        this.router.get('/activity/:id', this.userController.checkToken, this.activityController.showActivity);
        this.router.post('/strava-activities', this.userController.checkToken, this.activityController.importStravaActivities);
        this.router.post('/upload-activity', this.userController.checkToken, multer({
            storage: memoryStorage()
        }).single('gpxFile'), Storage.uploadGPX, this.activityController.uploadActivity);
        this.router.post('/manual-activity', this.userController.checkToken, this.activityController.createActivity);
        this.router.patch('/activity/:id', this.userController.checkToken, this.activityController.editActivity);
        this.router.delete('/activity/:id', this.userController.checkToken, this.activityController.deleteActivity);

        // Challenges
        this.router.get('/random-challenge', this.userController.checkToken, this.challengeController.viewRandomDashboardChallenge);
        this.router.get('/club-challenges/:userId', this.userController.checkToken, this.challengeController.getClubChallenges);
        this.router.get('/my-challenges', this.userController.checkToken, this.challengeController.getMyChallenges);
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
        this.router.patch('/event', this.userController.checkToken, this.eventController.updateEvent);
        this.router.delete('/event', this.userController.checkToken, this.eventController.deleteEvent);
        this.router.post('/participate-event/:eventId', this.userController.checkToken, this.eventController.participateEvent);
        this.router.post('/withdraw-event/:eventId', this.userController.checkToken, this.eventController.withdrawEvent);

        // Reset
        this.router.post('/reset', this.resetController.send);
        this.router.post('/reset/submit', this.resetController.submit);
    };
};