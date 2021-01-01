import { IConfig } from "../config";

import { default as passport, PassportStatic } from "passport";
import { default as passportLocal } from "passport-local";
import { default as passportJwt } from "passport-jwt";
import { default as jsonwebtoken } from "jsonwebtoken";

import { IUser, User } from "../../api";

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

    public createToken(user: IUser): string {
        const payload = {
            id: user._id,
        };

        return jsonwebtoken.sign(payload, this.config.auth.jwt.secret, {
            expiresIn: 60 * 120,
        }); 
    };
};