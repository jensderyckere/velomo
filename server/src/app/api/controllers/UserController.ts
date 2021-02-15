import { NextFunction, Request, Response} from "express";
import { default as passwordValidator } from "password-validator";
import { default as bcrypt } from "bcrypt";
import { default as Moment } from "moment";

import { Auth, IConfig } from "../../services";
import { Club, Cyclist, IClub, ICyclist, IMember, IParent, IUser, Member, Parent, User } from "../models";

import 'moment/locale/nl-be';

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
            const users = await User.find().populate('cyclistInfo').populate('clubInfo').exec();
            return res.status(200).json(users);
        } catch (e) {
            next(e);
        };
    };

    show = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId);

            let giveSpecificProps;

            if (user.role === "clubmember") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'member',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'club',
                                populate: {
                                    path: '_cyclistIds',
                                    populate: {
                                        path: '_userId',
                                        populate: {
                                            path: 'cyclist',
                                            popuplate: '_clubId',
                                        }
                                    },
                                },
                            },
                        },
                    },
                })
                .populate({
                    path: 'member',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'club',
                                populate: {
                                    path: '_memberIds',
                                    populate: {
                                        path: '_userId',
                                    },
                                },
                            },
                        },
                    },
                })
                .exec();
            };

            if (user.role === "cyclist") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_parentIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_activityIds',
                        options: { sort: {_createdAt: -1} }
                    },
                })
                .exec();
            };

            if (user.role === "club") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'club',
                    populate: {
                        path: '_cyclistIds',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'cyclist',
                            },
                        },
                    },
                })
                .populate({
                    path: 'club',
                    populate: {
                        path: '_memberIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .exec();
            };

            if (user.role === "parent") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'parent',
                    populate: {
                        path: '_cyclistIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .exec();
            };

            if (!user) return res.status(404).json({
                message: "Deze gebruiker werd niet gevonden.",
                redirect: false,
                status: 404,
            });

            return res.status(200).json(giveSpecificProps);
        } catch (e) {
            next(e);
        };
    };

    current = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get current logged in user
            const userId = this.auth.checkId(req, res);

            const user = await User.findById(userId);

            let giveSpecificProps;

            if (user.role === "clubmember") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'member',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'club',
                                populate: {
                                    path: '_cyclistIds',
                                    populate: {
                                        path: '_userId',
                                    },
                                },
                            },
                        },
                    },
                })
                .populate({
                    path: 'member',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'club',
                                populate: {
                                    path: '_memberIds',
                                    populate: {
                                        path: '_userId',
                                    },
                                },
                            },
                        },
                    },
                })
                .exec();
            };


            if (user.role === "cyclist") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_clubId',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_parentIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_activityIds',
                        options: { sort: {_createdAt: -1} }
                    },
                })
                .exec();
            };


            if (user.role === "club") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'club',
                    populate: {
                        path: '_cyclistIds',
                        populate: {
                            path: '_userId',
                            populate: {
                                path: 'cyclist',
                            },
                        },
                    },
                })
                .populate({
                    path: 'club',
                    populate: {
                        path: '_memberIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .exec();
            };

            if (user.role === "parent") {
                giveSpecificProps = await User.findById(userId)
                .populate({
                    path: 'parent',
                    populate: {
                        path: '_cyclistIds',
                        populate: {
                            path: '_userId',
                        },
                    },
                })
                .exec();
            };

            if (!user) return res.status(404).json({
                message: "Deze gebruiker werd niet gevonden.",
                redirect: false,
                status: 404,
            });

            return res.status(200).json(giveSpecificProps);
        } catch (e) {
            next(e);
        };
    };

    getCharts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Array of months
            const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

            // Get users id
            const contentToken = req.params.userId;
            
            const user = await User.findById(contentToken)
            .populate({
                path: 'cyclist',
                populate: {
                    path: '_activityIds',
                    options: { sort: {_createdAt: -1} }
                },
            })

            // Get last 6 months
            const date = new Date();
            const currentMonth = date.getMonth();

            let arrayOfMonths = [];

            let reserve = 12;
            let current = currentMonth;

            arrayOfMonths.push(current);

            // Deciding which month
            for (let i = 0; i < 5; i++) {
                current -= 1;
                if (current < 0 ){
                    reserve -= 1;
                    arrayOfMonths.unshift(reserve);
                } else {
                    arrayOfMonths.unshift(current);
                };
            };

            let results = [];

            // Searching for rides trough these moments
            for (let i = 0; i < arrayOfMonths.length; i++) {
                let object = {
                    index: arrayOfMonths[i],
                    month: months[arrayOfMonths[i]],
                    totalDistance: 0,
                };

                for (let j = 0; j < user.cyclist._activityIds.length; j++) {
                    const fullDate = Moment(user.cyclist._activityIds[j]._createdAt).format('L');
                    const splittedToMonth = fullDate.split('/')[1];
                    const setToIndex = Number(splittedToMonth) - 1;
                    
                    if (setToIndex === arrayOfMonths[i]) {
                        object.totalDistance += Number(user.cyclist._activityIds[j].activity.total_distance);
                    };
                };

                results.push(object);
            };

            // Decide max factors
            let maxDist = 0;

            for (let i = 0; i < results.length; i++) {
                const maxDistMonth = results[i].totalDistance;
                if (maxDist < maxDistMonth) maxDist = maxDistMonth;
            };

            const result = {
                maximum_distance: maxDist.toFixed(2),
                results: results,
            };

            return res.status(200).json(result);
        } catch (e) {
            next(e);
        };
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get users id
            const contentToken = this.auth.checkId(req, res);

            // Changing following fields
            const { name, location, cover, bio, avatar, firstName, lastName, _clubId } = req.body;

            const user = await User.findById(contentToken);

            let updatedUser;

            if (user.role === 'club') updatedUser = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'club.name': name,
                    'club.location': location,
                    'club.cover': cover,
                    'profile.bio': bio,
                    'profile.avatar': avatar,
                    'firstName': firstName,
                    'lastName': lastName,
                },
            }, {new: true}).exec();   
            
            if (user.role === 'clubmember') updatedUser = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'member._clubId': _clubId,
                    'profile.bio': bio,
                    'profile.avatar': avatar,
                    'firstName': firstName,
                    'lastName': lastName,
                },
            }, {new: true}).exec();   

            if (user.role === 'cyclist') updatedUser = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'cyclist._clubId': _clubId,
                    'profile.bio': bio,
                    'profile.avatar': avatar,
                    'firstName': firstName,
                    'lastName': lastName,
                },
            }, {new: true}).exec();  


            if (user.role === 'parent') updatedUser = await User.findOneAndUpdate({'_id': contentToken}, {
                $set: {
                    'profile.bio': bio,
                    'profile.avatar': avatar,
                    'firstName': firstName,
                    'lastName': lastName,
                },
            }, {new: true}).exec();  

            if (!updatedUser) return res.status(400).json({
                message: "Deze gebruiker kon niet worden bijgewerkt.",
                redirect: false,
                status: 400,
            });

            return res.status(200).json(updatedUser);
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

        const sendCode = await User.findOne({'_id': id});
        const placedCode = await User.findOne({'profile.uniqueCode': code});

        let receiver;
        let sender;

        switch (placedCode.role) {
            case "club":
                receiver = await Club.findOne({_userId: placedCode._id});
                break;
            case "cyclist":
                receiver = await Cyclist.findOne({_userId: placedCode._id});
                break;
            case "parent":
                receiver = await Parent.findOne({_userId: placedCode._id});
                break;   
            case "clubmember":
                receiver = await Member.findOne({_userId: placedCode._id});
                break;
            default:
                break;
        };

        switch (sendCode.role) {
            case "club":
                sender = await Club.findOne({_userId: sendCode._id});
                break;
            case "cyclist":
                sender = await Cyclist.findOne({_userId: sendCode._id});
                break;
            case "parent":
                sender = await Parent.findOne({_userId: sendCode._id});
                break;   
            case "clubmember":
                sender = await Member.findOne({_userId: sendCode._id});
                break;
            default:
                break;
        };

        if (sendCode.role === 'cyclist') {
            switch (placedCode.role) {
                case "club":
                    connectionSender = await User.findOneAndUpdate({_id: sendCode._id}, {
                        'cyclist._clubId': receiver._id,
                    });
                    connectionReceiver = await User.findOneAndUpdate({_id: placedCode._id}, {
                        $push: {
                            'club._cyclistIds': sender._id,
                        },
                    });
                    break;
                case "parent":
                    connectionSender = await User.findOneAndUpdate({_id: sendCode._id}, {
                        $push: {
                            'cyclist._parentIds': sender._id,
                        },
                    });
                    connectionReceiver = await User.findOneAndUpdate({_id: placedCode._id}, {
                        $push: {
                            'parent._cyclistIds': sender._id,
                        },
                    });
                    break;
                default:
                    break;
            };
        };

        if (sendCode.role === 'clubmember') {
            switch (placedCode.role) {
                case "club":
                    connectionSender = await User.findOneAndUpdate({_id: sendCode._id}, {
                        $push: {
                            'member._clubId': receiver._id,
                        },
                    });
                    connectionReceiver = await User.findOneAndUpdate({_id: placedCode._id}, {
                        $push: {
                            'club._memberIds': sender._id,
                        },
                    });
                    break;
                default:
                    break;
            };
        };

        if (sendCode.role === 'parent') {
            switch (placedCode.role) {
                case "cyclist":
                    connectionReceiver = await User.findOneAndUpdate({_id: sendCode._id}, {
                        $push: {
                            'club._cyclistIds': receiver._id,
                        },
                    });
                    connectionSender = await User.findOneAndUpdate({_id: placedCode._id}, {
                        'cyclist._clubId': sender._id,
                    });
                    break;
                default:
                    break;
            };
        };

        if (sendCode.role === 'club') {
            switch (placedCode.role) {
                case "cyclist":
                    connectionSender = await User.findOneAndUpdate({_id: sendCode._id}, {
                        $push: {
                            'member._clubId': receiver._id,
                        },
                    });
                    connectionReceiver = await User.findOneAndUpdate({_id: placedCode._id}, {
                        $push: {
                            'club._memberIds': sender._id,
                        },
                    });
                    break;
                case "clubmember":
                    break;
                default:
                    break;
            };
        };

        if (!connectionSender) return res.status(400).json({
            message: "De zender kon niet worden bijgewerkt.",
            redirect: false,
            status: 400,
        });

        if (!connectionReceiver) return res.status(400).json({
            message: "De ontvanger kon niet worden bijgewerkt.",
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

            let createUser : IUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                password: password,
                profile: {
                    uniqueCode: (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
                },
            });
    
            switch (role) {
                case "cyclist":
                    const createCyclistDoc : ICyclist = new Cyclist({
                        _userId: createUser._id,
                    });
                    await createCyclistDoc.save();
                    break;
                case "parent":
                    const createParentDoc : IParent = new Parent({
                        _userId: createUser._id,
                    });
                    await createParentDoc.save();
                    break;
                case "clubmember":
                    const createMemberDoc : IMember = new Member({
                        _userId: createUser._id,
                    });
                    await createMemberDoc.save();
                    break;
                case "club":
                    const createClubDoc : IClub = new Club({
                        _userId: createUser._id,
                    });
                    await createClubDoc.save();
                    break;
                default:
                    break;
            };
    
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