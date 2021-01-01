export enum Environment {
    development = 'development',
    testing = 'testing',
    production = 'production',
};

export enum Protocol {
    http = 'http',
    https = 'https',
};

export interface IServer {
    host: string;
    port: number;
    protocol: string;
};

export interface IJwt {
    secret: string;
    session: boolean;
};

export interface IAuth {
    bcryptSalt: number;
    jwt: IJwt;
};

export interface IMailer {
    mail: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
};

export interface IConfig {
    auth: any;
    env: Environment;
    server: IServer;
    dbConnection: string;
    mailer: IMailer;
};