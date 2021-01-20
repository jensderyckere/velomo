import { NextFunction, Request, Response} from "express";
import { default as passwordValidator } from "password-validator";
import { default as bcrypt } from "bcrypt";

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
        try {
            // Get all users
            const users = await User.find().exec();
            return res.status(200).json(users);
        } catch (e) {
            next(e);
        };
    };

    show = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId)
            .populate({path: 'clubInfo'})
            .populate({path: 'memberInfo'})
            .populate({path: 'cyclistInfo'})
            .populate({path: 'parentInfo'})
            .exec();

            if (!user) return res.status(404).json({
                message: "Deze gebruiker werd niet gevonden.",
                redirect: false,
                status: 404,
            });

            return res.status(200).json(user);
        } catch (e) {
            next(e);
        };
    };

    current = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get current logged in user
            const userId = this.auth.checkId(req, res);

            const user = await User.findById(userId)
            .populate({path: 'clubInfo'})
            .populate({path: 'memberInfo'})
            .populate({path: 'cyclistInfo'})
            .populate({path: 'parentInfo'})
            .exec();

            if (!user) return res.status(404).json({
                message: "Deze gebruiker werd niet gevonden.",
                redirect: false,
                status: 404,
            });

            return res.status(200).json(user);
        } catch (e) {
            next(e);
        };
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get users id
            const contentToken = this.auth.checkId(req, res);

            // Changing following fields
            const { avatar, firstName, lastName, bio, category } = req.body;

            const user = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'firstName': firstName,
                    'lastName': lastName,
                    'profile.avatar': avatar,
                    'profile.category': category,
                    'profile.bio': bio,
                },
            }, {new: true}).exec();

            if (!user) return res.status(400).json({
                message: "Deze gebruiker kon niet worden bijgewerkt.",
                redirect: false,
                status: 400,
            });

            return res.status(200).json(user);
        } catch (e) {
            next(e);
        };
    };

    updateSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get users id
            const contentToken = this.auth.checkId(req, res);

            // Changing following fields
            const { email } = req.body;

            const user = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'email': email,
                },
            }, {new: true}).exec();

            if (!user) return res.status(400).json({
                message: "Deze gebruiker kon niet worden bijgewerkt.",
                redirect: false,
                status: 400,
            });

            return res.status(200).json(user);
        } catch (e) {
            next(e);
        };
    };

    updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get users id
            const contentToken = this.auth.checkId(req, res);

            // Changing following fields
            const { password } = req.body;

            bcrypt.genSalt(10, (e, salt) => {
                if (e) return res.status(400).json({
                    message: "Deze gebruiker kon niet worden bijgewerkt.",
                    redirect: false,
                    status: 400,
                });

                bcrypt.hash(password, salt, async (er, hash) => {
                    const user : IUser = await User.findByIdAndUpdate({
                        _id: contentToken,
                    }, {
                        password: hash,
                    });

                    if (!user || er) return res.status(400).json({
                        message: "Deze gebruiker kon niet worden bijgewerkt.",
                        redirect: false,
                        status: 400,
                    });
    
                    return res.status(200).json(user);            
                });
            });
        } catch (e) {
            next(e);
        };
    };

    connectUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const { id, code } = req.body;

        let connectionReceiver;
        let connectionSender;

        const sender = await User.findOne({'_id': id});
        const receiver = await User.findOne({'profile.uniqueCode': code});

        if (sender.role === 'cyclist') {
            switch (receiver.role) {
                case "club":
                    connectionSender = await User.findOneAndUpdate({_id: sender._id}, {
                        'cyclist._clubId': receiver._id,
                    });
                    connectionReceiver = await User.findOneAndUpdate({_id: receiver._id}, {
                        $push: {
                            'club._cyclistIds': sender._id,
                        },
                    });
                    break;
                case "parent":
                    break;
                default:
                    break;
            };
        };

        if (sender.role === 'clubmember') {
            switch (receiver.role) {
                case "club":
                    break;
                default:
                    break;
            };
        };

        if (sender.role === 'parent') {
            switch (receiver.role) {
                case "cyclist":
                    break;
                default:
                    break;
            };
        };

        if (sender.role === 'club') {
            switch (receiver.role) {
                case "cyclist":
                    break;
                case "clubmember":
                    break;
                default:
                    break;
            };
        };

        if (!connectionReceiver) return res.status(400).json({
            message: "De ontvanger kon niet worden bijgewerkt.",
            redirect: false,
            status: 400,
        });

        if (!connectionSender) return res.status(400).json({
            message: "De zender kon niet worden bijgewerkt.",
            redirect: false,
            status: 400,
        });

        return res.status(200).json(connectionSender);
    };

    checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if user has admin role
            const contentToken = this.auth.checkRole(req, res);
            
            if (contentToken !== 'admin') return res.status(400).json({
                message: "Je kan deze actie niet uitvoeren.",
                redirect: false,
                status: 400,
            });

            next();
        } catch (e) {
            next(e);
        };
    };

    checkToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if token has valid user
            const contentToken = this.auth.checkId(req, res);

            const user = await User.findById(contentToken).exec();

            if (!user) return res.status(404).json({
                message: "Je kan deze actie niet uitvoeren.",
                redirect: false,
                status: 404,
            });

            next();
        } catch (e) {
            next(e);
        };
    };

    firstCheck = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { email, password, passwordRepeat } = req.body;

            // Check if password is valid
            let passwordCheck = new passwordValidator();
            passwordCheck.is().min(8).is().max(100).has().uppercase().has().lowercase();

            if (!passwordCheck.validate(password)) return res.status(409).json({
                message: "Dit wachtwoord is niet sterk genoeg. Maak gebruik van minimaal 8 karakters waar minimaal 1 hoofdletter aanwezig is.",
                redirect: false,
                status: 409,
            });

            // Check if passwords are the same
            if (password !== passwordRepeat) return res.status(409).json({
                message: "De wachtwoorden zijn niet identiek.",
                redirect: false,
                status: 409,
            });
    
            // Check if mail is already in use
            const checkIfExists = await User.findOne({email: email});

            if (checkIfExists) return res.status(409).json({
                message: "Dit e-mailadres word al gebruikt.",
                redirect: false,
                status: 409,
            });

            // Completed successfully
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
                profile: {
                    uniqueCode: (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
                },
            });
    
            const user: IUser = await createUser.save();

            if (!user) return res.status(400).json({
                message: "Could not register user",
                redirect: false,
                status: 400,
            });

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