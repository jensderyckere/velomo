import { default as express, Router } from "express";
import { default as multer, memoryStorage } from "multer";

import { Auth, IConfig, Storage } from "../../services";
import { PictureController, ResetController, UserController, ActivityController } from "../controllers";

var upload = multer();

export default class ApiRouter {
    public router: Router;
    private config: IConfig;
    private auth: Auth;

    private userController: UserController;
    private resetController: ResetController;
    private pictureController: PictureController;
    private activityController: ActivityController;

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
        this.activityController = new ActivityController(this.auth);
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

        // Authentication
        this.router.post('/login', this.userController.login);
        this.router.post('/register/first-check', this.userController.firstCheck);
        this.router.post('/register', this.userController.register);

        // Storage
        this.router.get('/picture/:avatar', this.pictureController.showAvatar);
        this.router.post('/picture/upload', multer({storage: memoryStorage()}).single('picture'), Storage.uploadAvatar, this.pictureController.uploadAvatar);
        this.router.delete('/picture/:avatar');

        // Activity
        this.router.get('/activity/:id', this.userController.checkToken, this.activityController.showActivity);
        this.router.post('/activity', this.userController.checkToken, multer({storage: memoryStorage()}).single('gpxFile'), Storage.uploadGPX, this.activityController.uploadActivity);
        this.router.post('/manual-activity', this.userController.checkToken, this.activityController.createActivity);
        this.router.patch('/activity/:id', this.userController.checkToken, this.activityController.editActivity);
        this.router.delete('/activity/:id', this.userController.checkToken, this.activityController.deleteActivity);

        // Reset
        this.router.post('/reset', this.resetController.send);
        this.router.post('/reset/submit', this.resetController.submit);
    };
};