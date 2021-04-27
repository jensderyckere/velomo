"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const config_types_1 = require("./config.types");
class Config {
    constructor() {
        dotenv_1.default.config();
        this.loadConfig();
    }
    ;
    loadConfig() {
        this.env = config_types_1.Environment[(process.env.NODE_ENV || config_types_1.Environment.development)];
        this.server = {
            host: process.env.NODE_HOST || 'localhost',
            port: Number(process.env.NODE_PORT || 8000),
            protocol: config_types_1.Protocol[(process.env.NODE_PROTOCOL || config_types_1.Protocol.http)],
        };
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
        };
    }
    ;
}
exports.default = Config;
;
//# sourceMappingURL=Config.js.map