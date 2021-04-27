"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const services_1 = require("./services");
const router_1 = require("./router");
const middleware_1 = require("./middleware");
class App {
    constructor(config) {
        this.config = config;
        this.initExpress();
        this.initServer();
    }
    ;
    initExpress() {
        this.app = express_1.default();
        middleware_1.Middleware.load(this.app, this.config);
        this.startAuth();
        this.startRouter();
    }
    ;
    initServer() {
        this.server = http_1.createServer(this.app);
        this.server.on('error', (e) => {
            this.gracefullShutdown(e);
        });
        this.server.on('close', () => {
            console.log('Closing the server');
        });
        this.server.on('listening', () => {
            console.log('Started the server on localhost:8000');
        });
    }
    ;
    startAuth() {
        this.auth = new services_1.Auth(this.config);
    }
    ;
    startRouter() {
        this.router = new router_1.Router(this.config, this.app, this.auth);
    }
    ;
    startServer() {
        this.server.listen(Number(process.env.PORT || 8000), '0.0.0.0');
    }
    ;
    stopServer() {
        this.server.close((e) => {
            this.gracefullShutdown(e);
        });
    }
    ;
    gracefullShutdown(e) {
        if (e) {
            process.exit(1);
        }
        ;
        process.exit();
    }
    ;
}
exports.default = App;
;
//# sourceMappingURL=App.js.map