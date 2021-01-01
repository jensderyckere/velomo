import { NextFunction, Request, Response} from "express";

import { Auth, IConfig } from "../../services";
import { IUser, User } from "../models";

export default class UserController {
    private auth: Auth;
    private config: IConfig;

    constructor(auth: Auth, config: IConfig) {
        this.auth = auth;
        this.config = config;
    };

    register = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const {email, password, firstName, lastName, role} = req.body;

            const checkIfExists = await User.findOne({email: email});
    
            if (checkIfExists) return res.status(409).json({
                message: "This user already exists",
                redirect: false,
                status: 409,
            });
    
            const createUser: IUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                password: password,
            });
    
            const user: IUser = await createUser.save();
            const token = this.auth.createToken(user);

            return res.status(200).json({
                token: token,
                redirect: true,
                status: 200,
            });
        } catch (e) {
            next(e)
        };
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            this.auth.passport.authenticate('local', {
                session: this.config.auth.jwt.session,
            }, (e, user) => {
                if (e) {
                    return next(e);
                };
    
                if (!user) {
                    return res.status(404).json({
                        message: "This user can't be found",
                        redirect: false,
                        status: 404,
                    });
                };
    
                const token = this.auth.createToken(user);
    
                return res.status(200).json({
                    message: "User is logged in",
                    redirect: true,
                    status: 200,
                    token: token,
                });
            });
        } catch (e) {
            next(e);
        }
    };
};