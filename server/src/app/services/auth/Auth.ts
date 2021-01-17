import { default as passport, PassportStatic } from "passport";
import { default as passportLocal } from "passport-local";
import { default as passportJwt } from "passport-jwt";
import { default as jsonwebtoken } from "jsonwebtoken";
import { Request, Response } from "express";

import { IConfig } from "../config";
import { IUser, User } from "../../api";

interface IDecoded {
    id: string;
    role: string;
};

export default class Auth {
    private config: IConfig;
    public passport: PassportStatic;

    private local = passportLocal.Strategy;
    private jwt = passportJwt.Strategy;
    private extractJwt = passportJwt.ExtractJwt;

    constructor(config: IConfig) {
        this.config = config;

        this.initLocal();
        this.initJwt();

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

        this.passport = passport;
    };

    private initLocal() {
        passport.use(new this.local({
            usernameField: 'email'
        }, async (email: string, password: string, done) => {
            try {
                const user = await User.findOne({email: email});

                if (!user) {
                    return done(null, false, {
                        message: 'NON-EXISTING USER',
                    });
                };

                return user.comparePassword(password, (e: any, match: boolean) => {
                    if (!match) {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    };
                });
            } catch (e) {
                return done(e, false);
            }
        }));
    };

    private initJwt() {
        passport.use(new this.jwt({
           jwtFromRequest: this.extractJwt.fromAuthHeaderAsBearerToken(),
           secretOrKey: this.config.auth.jwt.secret,
        }, async (payload, done) => {
            try {
                const { id } = payload;

                const user = await User.findById(id);

                if (!user) done(null, false);

                done(null, user);
            } catch(e) {
                return done(e, false);
            }
        }));
    };

    public checkRole(req: Request, res: Response) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(404).json({
                message: "Dit is geen geldige token.",
                redirect: false,
                status: 409,
            });
        };

        const decoded = jsonwebtoken.verify(token, this.config.auth.jwt.secret);
        const data = decoded as IDecoded;
        return data.role;
    };

    public checkId(req: Request, res: Response) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(404).json({
                message: "Dit is geen geldige token.",
                redirect: false,
                status: 409,
            });
        };

        const decoded = jsonwebtoken.verify(token, this.config.auth.jwt.secret);
        const data = decoded as IDecoded;
        return data.id;
    };

    public createToken(user: IUser): string {
        const payload = {
            id: user._id,
            role: user.role,
        };

        return jsonwebtoken.sign(payload, this.config.auth.jwt.secret, {
            expiresIn: 60 * 120,
        }); 
    };
};