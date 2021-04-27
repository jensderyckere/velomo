"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_1 = require("../../api");
;
class Auth {
    constructor(config) {
        this.local = passport_local_1.default.Strategy;
        this.jwt = passport_jwt_1.default.Strategy;
        this.extractJwt = passport_jwt_1.default.ExtractJwt;
        this.config = config;
        this.initLocal();
        this.initJwt();
        passport_1.default.serializeUser((user, done) => {
            done(null, user);
        });
        passport_1.default.deserializeUser((user, done) => {
            done(null, user);
        });
        this.passport = passport_1.default;
    }
    ;
    initLocal() {
        passport_1.default.use(new this.local({
            usernameField: 'email'
        }, async (email, password, done) => {
            try {
                const user = await api_1.User.findOne({
                    email: email
                });
                if (!user) {
                    return done(null, false, {
                        message: 'NON-EXISTING USER',
                    });
                }
                ;
                return user.comparePassword(password, (e, match) => {
                    if (!match) {
                        return done(null, false);
                    }
                    else {
                        return done(null, user);
                    }
                    ;
                });
            }
            catch (e) {
                return done(e, false);
            }
        }));
    }
    ;
    initJwt() {
        passport_1.default.use(new this.jwt({
            jwtFromRequest: this.extractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: this.config.auth.jwt.secret,
        }, async (payload, done) => {
            try {
                const { id } = payload;
                const user = await api_1.User.findById(id);
                if (!user)
                    done(null, false);
                done(null, user);
            }
            catch (e) {
                return done(e, false);
            }
        }));
    }
    ;
    checkRole(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(404).json({
                message: "Dit is geen geldige token.",
                redirect: false,
                status: 409,
            });
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, this.config.auth.jwt.secret);
        const data = decoded;
        return data.role;
    }
    ;
    checkId(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(404).json({
                message: "Dit is geen geldige token.",
                redirect: false,
                status: 409,
            });
        }
        ;
        const decoded = jsonwebtoken_1.default.verify(token, this.config.auth.jwt.secret);
        const data = decoded;
        return data.id;
    }
    ;
    createToken(user) {
        const payload = {
            id: user._id,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, this.config.auth.jwt.secret, {
            expiresIn: 60 * 120,
        });
    }
    ;
}
exports.default = Auth;
;
//# sourceMappingURL=Auth.js.map