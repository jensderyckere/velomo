import { default as express, Router } from "express";

import { Auth, IConfig } from "../../services";
import {ResetController, UserController} from "../controllers";

export default class ApiRouter {
    public router: Router;
    private config: IConfig;
    private auth: Auth;

    private userController: UserController;
    private resetController: ResetController;

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
    };

    private initRoutes(): void {
        // User routes
        this.router.post('/login', this.userController.login);
        this.router.post('/register', this.userController.register);

        // Reset routes
        this.router.post('/reset', this.resetController.send);
        this.router.post('/reset/submit', this.resetController.submit);
    };
};