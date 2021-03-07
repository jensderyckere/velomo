import {
    default as dotenv
} from 'dotenv';

import {
    Environment,
    IAuth,
    IConfig,
    IMailer,
    IServer,
    Protocol
} from "./config.types";

export default class Config implements IConfig {
    public env: Environment;
    public auth: IAuth;
    public server: IServer;
    public dbConnection: string;
    public mailer: IMailer;

    constructor() {
        dotenv.config();

        this.loadConfig();
    };

    private loadConfig(): void {
        this.env = Environment[(process.env.NODE_ENV || Environment.development) as keyof typeof Environment];
        this.server = {
            host: process.env.NODE_HOST || 'localhost',
            port: Number(process.env.NODE_PORT || 8000),
            protocol: Protocol[(process.env.NODE_PROTOCOL || Protocol.http) as keyof typeof Protocol],
        } as IServer;
        this.auth = {
            jwt: {
                secret: process.env.NODE_AUTH_SECRET,
                session: Boolean(process.env.NODE_AUTH_SESSION || true),
            },
            bcryptSalt: Number(process.env.NODE_AUTH_SALT || 10),
        };
        this.dbConnection = process.env.NODE_MONGO_DB;
        this.mailer = {
            host: process.env.NODE_MAILER_HOST,
            port: Number(process.env.NODE_MAILER_PORT),
            secure: Boolean(process.env.NODE_MAILER_SECURE),
            mail: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASS,
        }
    };
};