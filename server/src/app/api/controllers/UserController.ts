import { NextFunction, Request, Response} from "express";
import { default as passwordValidator } from "password-validator";

import { Auth, IConfig } from "../../services";
import { IUser, User } from "../models";

export default class UserController {
    private auth: Auth;
    private config: IConfig;

    constructor(auth: Auth, config: IConfig) {
        this.auth = auth;
        this.config = config;
    };

    all = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const users = await User.find().exec();

        return res.status(200).json(users);
    };

    firstCheck = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { email, password, passwordRepeat } = req.body;

            const checkIfExists = await User.findOne({email: email});

            let passwordCheck = new passwordValidator();
            passwordCheck.is().min(8).is().max(100).has().uppercase().has().lowercase();

            if (!passwordCheck.validate(password)) return res.status(409).json({
                message: "Dit wachtwoord is niet sterk genoeg. maak gebruik van minimaal 8 karakters waar minimaal 1 hoofdletter aanwezig is.",
                redirect: false,
                status: 409,
            });

            if (password !== passwordRepeat) return res.status(409).json({
                message: "De wachtwoorden zijn niet identiek.",
                redirect: false,
                status: 409,
            });
    
            if (checkIfExists) return res.status(409).json({
                message: "Dit e-mailadres word al gebruikt.",
                redirect: false,
                status: 409,
            });

            return res.status(200).json({
                message: "Check-up has completed successfully",
                redirect: true,
                status: 200,
            });
        } catch (e) {
            next(e);
        };
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
                        message: "Deze gebruiker lijkt niet te bestaan",
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
            })(req, res, next);
        } catch (e) {
            next(e);
        };
    };
};