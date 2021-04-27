"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
class Middleware {
    static load(app, config) {
        app.use(body_parser_1.default.urlencoded({
            limit: '250mb',
            extended: true
        }));
        app.use(body_parser_1.default.json({
            limit: '250mb'
        }));
        app.use(helmet_1.default.hidePoweredBy());
        app.use(helmet_1.default.ieNoOpen());
        app.use(helmet_1.default.noSniff());
        app.use(helmet_1.default.xssFilter());
        app.use(cors_1.default({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            exposedHeaders: ['x-auth-token'],
        }));
    }
    ;
}
exports.default = Middleware;
;
//# sourceMappingURL=Middleware.js.map