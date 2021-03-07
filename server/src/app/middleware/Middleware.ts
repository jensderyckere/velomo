import {
    Application
} from "express";

import {
    default as helmet
} from "helmet";

import {
    default as bodyparser
} from "body-parser";

import {
    default as cors
} from "cors";

import {
    IConfig
} from "../services";

export default class Middleware {
    public static load(app: Application, config: IConfig) {
        app.use(bodyparser.urlencoded({
            limit: '50mb',
            extended: false
        }));
        app.use(bodyparser.json({
            limit: '50mb'
        }));

        app.use(helmet.hidePoweredBy());
        app.use(helmet.ieNoOpen());
        app.use(helmet.noSniff());
        app.use(helmet.xssFilter());

        app.use(cors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            exposedHeaders: ['x-auth-token'],
        }));
    };
};