import {
    createServer,
    Server
} from 'http';

import {
    default as express,
    Application
} from 'express';

import {
    IConfig,
    Auth
} from './services';

import {
    Router
} from './router';

import {
    Middleware
} from './middleware';

export default class App {
    public app: Application;
    private config: IConfig;
    private server: Server;
    private router: Router;
    private auth: Auth;

    constructor(config: IConfig) {
        this.config = config;

        this.initExpress();
        this.initServer();
    };

    private initExpress(): void {
        this.app = express();

        Middleware.load(this.app, this.config);

        this.startAuth();
        this.startRouter();
    };

    private initServer(): void {
        this.server = createServer(this.app);
        this.server.on('error', (e ? : Error) => {
            this.gracefullShutdown(e);
        });
        this.server.on('close', () => {
            console.log('Closing the server');
        });
        this.server.on('listening', () => {
            console.log('Started the server on localhost:8000');
        });
    };

    private startAuth(): void {
        this.auth = new Auth(this.config);
    };

    private startRouter(): void {
        this.router = new Router(this.config, this.app, this.auth);
    };

    public startServer(): void {
        this.server.listen(Number(process.env.PORT || 8000), '0.0.0.0');
    };

    public stopServer(): void {
        this.server.close((e ? : Error) => {
            this.gracefullShutdown(e);
        });
    };

    private gracefullShutdown(e ? : Error): void {
        if (e) {
            process.exit(1);
        };

        process.exit();
    };
};