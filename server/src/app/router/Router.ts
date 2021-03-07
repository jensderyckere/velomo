import {
    Application
} from "express";

import {
    ApiRouter
} from "../api";

import {
    Auth,
    IConfig
} from "../services";

export default class Router {
    private app: Application;
    private config: IConfig;
    private apiRouter: ApiRouter;
    private auth: Auth;

    constructor(config: IConfig, app: Application, auth: Auth) {
        this.config = config;
        this.app = app;
        this.auth = auth;

        this.apiRouter = new ApiRouter(this.config, this.auth);

        this.startRouting();
    };

    private startRouting(): void {
        this.app.use('/velomo-api', this.apiRouter.router);
    };
};