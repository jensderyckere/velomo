import { default as express, Router } from "express";
import { default as multer, memoryStorage } from "multer";

import { Auth, IConfig, Storage } from "../../services";
import { PictureController, ResetController, UserController, ActivityController, ChallengeController, VideoController } from "../controllers";

var upload = multer();

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
    };

    private initRoutes(): void {
        // User
        this.router.get('/users', this.userController.checkAdmin, this.userController.all);
        this.router.get('/users-charts/:userId', this.userController.checkToken, this.userController.getCharts);
        this.router.get('/users/:userId', this.userController.checkToken, this.userController.show);
        this.router.get('/current-user/', this.userController.checkToken, this.userController.current);
        this.router.patch('/users/profile', this.userController.checkToken, this.userController.updateProfile);
        this.router.patch('/users/settings', this.userController.checkToken, this.userController.updateSettings);
        this.router.patch('/users/password', this.userController.checkToken, this.userController.updatePassword);
        this.router.patch('/users/connections', this.userController.checkToken, this.userController.connectUsers);
        this.router.patch('/users/add-experience', this.userController.checkToken, this.userController.addExperience);

        // Authentication
        this.router.post('/login', this.userController.login);
        this.router.post('/register/first-check', this.userController.firstCheck);
        this.router.post('/register', this.userController.register);

        // Storage
        this.router.get('/picture/:avatar', this.pictureController.showAvatar);
        this.router.get('/video/:video', this.videoController.showVideo);
        this.router.post('/picture/upload', multer({storage: memoryStorage()}).single('picture'), Storage.uploadAvatar, this.pictureController.uploadAvatar);
        this.router.post('/video/upload', multer({storage: memoryStorage()}).single('video'), Storage.uploadVideo, this.videoController.uploadVideo);

        // Activity
        this.router.get('/activity/:id', this.userController.checkToken, this.activityController.showActivity);
        this.router.post('/activity', this.userController.checkToken, multer({storage: memoryStorage()}).single('gpxFile'), Storage.uploadGPX, this.activityController.uploadActivity);
        this.router.post('/manual-activity', this.userController.checkToken, this.activityController.createActivity);
        this.router.patch('/activity/:id', this.userController.checkToken, this.activityController.editActivity);
        this.router.delete('/activity/:id', this.userController.checkToken, this.activityController.deleteActivity);

        // Challenges
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
        this.router.post('/approve-submission/:challengeId', this.userController.checkToken, this.challengeController.approveSubmission);

        // Reset
        this.router.post('/reset', this.resetController.send);
        this.router.post('/reset/submit', this.resetController.submit);
    };
};