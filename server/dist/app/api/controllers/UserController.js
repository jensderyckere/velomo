"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_validator_1 = __importDefault(require("password-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
require("moment/locale/nl-be");
class UserController {
    constructor(auth, config) {
        this.all = async (req, res, next) => {
            try {
                // Get all users
                const users = await models_1.User.find().populate('cyclistInfo').populate('clubInfo').exec();
                return res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.show = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const user = await models_1.User.findById(userId);
                let giveSpecificProps;
                if (user.role === "clubmember") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                }
                ;
                if (user.role === "cyclist") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                            options: {
                                sort: {
                                    _createdAt: -1
                                }
                            }
                        },
                    })
                        .exec();
                }
                ;
                if (user.role === "club") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                }
                ;
                if (user.role === "parent") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                }
                ;
                if (!user)
                    return res.status(404).json({
                        message: "Deze gebruiker werd niet gevonden.",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(giveSpecificProps);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.current = async (req, res, next) => {
            try {
                // Get current logged in user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId);
                let giveSpecificProps;
                if (user.role === "clubmember") {
                    giveSpecificProps = await models_1.User.findById(userId)
                        .populate({
                        path: 'member',
                        populate: {
                            path: '_clubId',
                            populate: {
                                path: '_userId',
                                populate: {
                                    path: 'club',
                                },
                            },
                        },
                    })
                        .exec();
                }
                ;
                if (user.role === "cyclist") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                            options: {
                                sort: {
                                    _createdAt: -1
                                }
                            }
                        },
                    })
                        .populate({
                        path: 'cyclist',
                        populate: {
                            path: '_challengeIds',
                            populate: '_challengeId'
                        },
                    })
                        .exec();
                }
                ;
                if (user.role === "club") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                }
                ;
                if (user.role === "parent") {
                    giveSpecificProps = await models_1.User.findById(userId)
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
                }
                ;
                if (!user)
                    return res.status(404).json({
                        message: "Deze gebruiker werd niet gevonden.",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).json(giveSpecificProps);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.showViaId = async (req, res, next) => {
            try {
                const { id, type } = req.params;
                let result;
                if (type === 'cyclist') {
                    result = await models_1.Cyclist.findById(id).populate({ path: '_userId' }).exec();
                }
                ;
                if (type === 'clubmember') {
                    result = await models_1.Member.findById(id).populate({ path: '_userId' }).exec();
                }
                ;
                return res.status(200).json(result);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getCharts = async (req, res, next) => {
            try {
                // Array of months
                const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
                // Get users id
                const contentToken = req.params.userId;
                const user = await models_1.User.findById(contentToken)
                    .populate({
                    path: 'cyclist',
                    populate: {
                        path: '_activityIds',
                        options: {
                            sort: {
                                _createdAt: -1
                            }
                        }
                    },
                });
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
                    if (current < 0) {
                        reserve -= 1;
                        arrayOfMonths.unshift(reserve);
                    }
                    else {
                        arrayOfMonths.unshift(current);
                    }
                    ;
                }
                ;
                let results = [];
                // Searching for rides trough these moments
                for (let i = 0; i < arrayOfMonths.length; i++) {
                    let object = {
                        index: arrayOfMonths[i],
                        month: months[arrayOfMonths[i]],
                        totalDistance: 0,
                    };
                    for (let j = 0; j < user.cyclist._activityIds.length; j++) {
                        const fullDate = moment_1.default(user.cyclist._activityIds[j]._createdAt).format('L');
                        const splittedToMonth = fullDate.split('/')[1];
                        const setToIndex = Number(splittedToMonth) - 1;
                        if (setToIndex === arrayOfMonths[i]) {
                            object.totalDistance += (Number(user.cyclist._activityIds[j].result.distance) / 1000);
                        }
                        ;
                    }
                    ;
                    results.push(object);
                }
                ;
                // Decide max factors
                let maxDist = 0;
                for (let i = 0; i < results.length; i++) {
                    const maxDistMonth = results[i].totalDistance;
                    if (maxDist < maxDistMonth)
                        maxDist = maxDistMonth;
                }
                ;
                const result = {
                    maximum_distance: maxDist.toFixed(2),
                    results: results,
                };
                return res.status(200).json(result);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.updateProfile = async (req, res, next) => {
            try {
                // Get users id
                const contentToken = this.auth.checkId(req, res);
                // Changing following fields
                const { name, location, cover, bio, avatar, firstName, lastName, _clubId } = req.body;
                const user = await models_1.User.findById(contentToken);
                let updatedUser;
                if (user.role === 'club')
                    updatedUser = await models_1.User.findOneAndUpdate({
                        '_id': contentToken
                    }, {
                        $set: {
                            'club.name': name,
                            'club.location': location,
                            'club.cover': cover,
                            'profile.bio': bio,
                            'profile.avatar': avatar,
                            'firstName': firstName,
                            'lastName': lastName,
                        },
                    }, {
                        new: true
                    }).exec();
                if (user.role === 'clubmember')
                    updatedUser = await models_1.User.findOneAndUpdate({
                        '_id': contentToken
                    }, {
                        $set: {
                            'member._clubId': _clubId,
                            'profile.bio': bio,
                            'profile.avatar': avatar,
                            'firstName': firstName,
                            'lastName': lastName,
                        },
                    }, {
                        new: true
                    }).exec();
                if (user.role === 'cyclist')
                    updatedUser = await models_1.User.findOneAndUpdate({
                        '_id': contentToken
                    }, {
                        $set: {
                            'cyclist._clubId': _clubId,
                            'profile.bio': bio,
                            'profile.avatar': avatar,
                            'firstName': firstName,
                            'lastName': lastName,
                        },
                    }, {
                        new: true
                    }).exec();
                if (user.role === 'parent')
                    updatedUser = await models_1.User.findOneAndUpdate({
                        '_id': contentToken
                    }, {
                        $set: {
                            'profile.bio': bio,
                            'profile.avatar': avatar,
                            'firstName': firstName,
                            'lastName': lastName,
                        },
                    }, {
                        new: true
                    }).exec();
                if (!updatedUser)
                    return res.status(400).json({
                        message: "Deze gebruiker kon niet worden bijgewerkt.",
                        redirect: false,
                        status: 400,
                    });
                return res.status(200).json(updatedUser);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.updateSettings = async (req, res, next) => {
            try {
                // Get users id
                const contentToken = this.auth.checkId(req, res);
                // Changing following fields
                const { email } = req.body;
                const user = await models_1.User.findOneAndUpdate({
                    '_id': contentToken
                }, {
                    $set: {
                        'email': email,
                    },
                }, {
                    new: true
                }).exec();
                if (!user)
                    return res.status(400).json({
                        message: "Deze gebruiker kon niet worden bijgewerkt.",
                        redirect: false,
                        status: 400,
                    });
                return res.status(200).json(user);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.updatePassword = async (req, res, next) => {
            try {
                // Get users id
                const contentToken = this.auth.checkId(req, res);
                // Changing following fields
                const { password } = req.body;
                bcrypt_1.default.genSalt(10, (e, salt) => {
                    if (e)
                        return res.status(400).json({
                            message: "Deze gebruiker kon niet worden bijgewerkt.",
                            redirect: false,
                            status: 400,
                        });
                    bcrypt_1.default.hash(password, salt, async (er, hash) => {
                        const user = await models_1.User.findByIdAndUpdate({
                            _id: contentToken,
                        }, {
                            password: hash,
                        });
                        if (!user || er)
                            return res.status(400).json({
                                message: "Deze gebruiker kon niet worden bijgewerkt.",
                                redirect: false,
                                status: 400,
                            });
                        return res.status(200).json(user);
                    });
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.connectUsers = async (req, res, next) => {
            const { id, code } = req.body;
            let connectionReceiver;
            let connectionSender;
            const sendCode = await models_1.User.findOne({
                '_id': id
            });
            const placedCode = await models_1.User.findOne({
                'profile.uniqueCode': code
            });
            let receiver;
            let sender;
            switch (placedCode.role) {
                case "club":
                    receiver = await models_1.Club.findOne({
                        _userId: placedCode._id
                    });
                    break;
                case "cyclist":
                    receiver = await models_1.Cyclist.findOne({
                        _userId: placedCode._id
                    });
                    break;
                case "parent":
                    receiver = await models_1.Parent.findOne({
                        _userId: placedCode._id
                    });
                    break;
                case "clubmember":
                    receiver = await models_1.Member.findOne({
                        _userId: placedCode._id
                    });
                    break;
                default:
                    break;
            }
            ;
            switch (sendCode.role) {
                case "club":
                    sender = await models_1.Club.findOne({
                        _userId: sendCode._id
                    });
                    break;
                case "cyclist":
                    sender = await models_1.Cyclist.findOne({
                        _userId: sendCode._id
                    });
                    break;
                case "parent":
                    sender = await models_1.Parent.findOne({
                        _userId: sendCode._id
                    });
                    break;
                case "clubmember":
                    sender = await models_1.Member.findOne({
                        _userId: sendCode._id
                    });
                    break;
                default:
                    break;
            }
            ;
            if (sendCode.role === 'cyclist') {
                switch (placedCode.role) {
                    case "club":
                        connectionSender = await models_1.User.findOneAndUpdate({
                            _id: sendCode._id
                        }, {
                            'cyclist._clubId': receiver._id,
                        });
                        connectionReceiver = await models_1.User.findOneAndUpdate({
                            _id: placedCode._id
                        }, {
                            $push: {
                                'club._cyclistIds': sender._id,
                            },
                        });
                        break;
                    case "parent":
                        connectionSender = await models_1.User.findOneAndUpdate({
                            _id: sendCode._id
                        }, {
                            $push: {
                                'cyclist._parentIds': sender._id,
                            },
                        });
                        connectionReceiver = await models_1.User.findOneAndUpdate({
                            _id: placedCode._id
                        }, {
                            $push: {
                                'parent._cyclistIds': sender._id,
                            },
                        });
                        break;
                    default:
                        break;
                }
                ;
            }
            ;
            if (sendCode.role === 'clubmember') {
                switch (placedCode.role) {
                    case "club":
                        connectionSender = await models_1.User.findOneAndUpdate({
                            _id: sendCode._id
                        }, {
                            $push: {
                                'member._clubId': receiver._id,
                            },
                        });
                        connectionReceiver = await models_1.User.findOneAndUpdate({
                            _id: placedCode._id
                        }, {
                            $push: {
                                'club._memberIds': sender._id,
                            },
                        });
                        break;
                    default:
                        break;
                }
                ;
            }
            ;
            if (sendCode.role === 'parent') {
                switch (placedCode.role) {
                    case "cyclist":
                        connectionReceiver = await models_1.User.findOneAndUpdate({
                            _id: sendCode._id
                        }, {
                            $push: {
                                'parent._cyclistIds': receiver._id,
                            },
                        });
                        connectionSender = await models_1.User.findOneAndUpdate({
                            _id: placedCode._id
                        }, {
                            $push: {
                                'cylist._parentIds': sender._id,
                            },
                        });
                        break;
                    default:
                        break;
                }
                ;
            }
            ;
            if (sendCode.role === 'club') {
                switch (placedCode.role) {
                    case "cyclist":
                        connectionSender = await models_1.User.findOneAndUpdate({
                            _id: sendCode._id
                        }, {
                            $push: {
                                'member._clubId': receiver._id,
                            },
                        });
                        connectionReceiver = await models_1.User.findOneAndUpdate({
                            _id: placedCode._id
                        }, {
                            $push: {
                                'club._memberIds': sender._id,
                            },
                        });
                        break;
                    case "clubmember":
                        break;
                    default:
                        break;
                }
                ;
            }
            ;
            if (!connectionSender)
                return res.status(400).json({
                    message: "De zender kon niet worden bijgewerkt.",
                    redirect: false,
                    status: 400,
                });
            if (!connectionReceiver)
                return res.status(400).json({
                    message: "De ontvanger kon niet worden bijgewerkt.",
                    redirect: false,
                    status: 400,
                });
            return res.status(200).json(connectionSender);
        };
        this.disconnectUsers = async (req, res, next) => {
            try {
                const { senderId, receiverId } = req.body;
                const sender = await models_1.User.findById(senderId).exec();
                const receiver = await models_1.User.findById(receiverId).exec();
                let connectionReceiver;
                let connectionSender;
                if (sender.role === 'cyclist') {
                    switch (receiver.role) {
                        case "club":
                            connectionSender = await models_1.User.findOneAndUpdate({
                                _id: sender._id
                            }, {
                                'cyclist._clubId': null,
                            });
                            connectionReceiver = await models_1.User.findOneAndUpdate({
                                _id: receiver._id
                            }, {
                                $pull: {
                                    'club._cyclistIds': sender._id,
                                },
                            });
                            break;
                        case "parent":
                            connectionSender = await models_1.User.findOneAndUpdate({
                                _id: sender._id
                            }, {
                                $pull: {
                                    'cyclist._parentIds': sender._id,
                                },
                            });
                            connectionReceiver = await models_1.User.findOneAndUpdate({
                                _id: receiver._id
                            }, {
                                $pull: {
                                    'parent._cyclistIds': sender._id,
                                },
                            });
                            break;
                        default:
                            break;
                    }
                    ;
                }
                ;
                if (sender.role === 'clubmember') {
                    switch (receiver.role) {
                        case "club":
                            connectionSender = await models_1.User.findOneAndUpdate({
                                _id: sender._id
                            }, {
                                $pull: {
                                    'member._clubId': receiver._id,
                                },
                            });
                            connectionReceiver = await models_1.User.findOneAndUpdate({
                                _id: receiver._id
                            }, {
                                $pull: {
                                    'club._memberIds': sender._id,
                                },
                            });
                            break;
                        default:
                            break;
                    }
                    ;
                }
                ;
                if (sender.role === 'parent') {
                    switch (receiver.role) {
                        case "cyclist":
                            connectionReceiver = await models_1.User.findOneAndUpdate({
                                _id: sender._id
                            }, {
                                $pull: {
                                    'club._cyclistIds': receiver._id,
                                },
                            });
                            connectionSender = await models_1.User.findOneAndUpdate({
                                _id: receiver._id
                            }, {
                                'cyclist._clubId': null,
                            });
                            break;
                        default:
                            break;
                    }
                    ;
                }
                ;
                if (sender.role === 'club') {
                    switch (receiver.role) {
                        case "cyclist":
                            connectionSender = await models_1.User.findOneAndUpdate({
                                _id: sender._id
                            }, {
                                $pull: {
                                    'member._clubId': receiver._id,
                                },
                            });
                            connectionReceiver = await models_1.User.findOneAndUpdate({
                                _id: receiver._id
                            }, {
                                $pull: {
                                    'club._memberIds': sender._id,
                                },
                            });
                            break;
                        case "clubmember":
                            break;
                        default:
                            break;
                    }
                    ;
                }
                ;
                if (!connectionSender)
                    return res.status(400).json({
                        message: "De zender kon niet worden bijgewerkt.",
                        redirect: false,
                        status: 400,
                    });
                if (!connectionReceiver)
                    return res.status(400).json({
                        message: "De ontvanger kon niet worden bijgewerkt.",
                        redirect: false,
                        status: 400,
                    });
                return res.status(200).json(connectionSender);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.checkAdmin = async (req, res, next) => {
            try {
                // Check if user has admin role
                const contentToken = this.auth.checkRole(req, res);
                if (contentToken !== 'admin')
                    return res.status(400).json({
                        message: "Je kan deze actie niet uitvoeren.",
                        redirect: false,
                        status: 400,
                    });
                next();
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.checkToken = async (req, res, next) => {
            try {
                // Check if token has valid user
                const contentToken = this.auth.checkId(req, res);
                const user = await models_1.User.findById(contentToken).exec();
                if (!user)
                    return res.status(404).json({
                        message: "Je kan deze actie niet uitvoeren.",
                        redirect: false,
                        status: 404,
                    });
                next();
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.firstCheck = async (req, res, next) => {
            try {
                const { email, password, passwordRepeat } = req.body;
                // Check if password is valid
                let passwordCheck = new password_validator_1.default();
                passwordCheck.is().min(8).is().max(100).has().uppercase().has().lowercase();
                if (!passwordCheck.validate(password))
                    return res.status(409).json({
                        message: "Dit wachtwoord is niet sterk genoeg. Maak gebruik van minimaal 8 karakters waar minimaal 1 hoofdletter aanwezig is.",
                        redirect: false,
                        status: 409,
                    });
                // Check if passwords are the same
                if (password !== passwordRepeat)
                    return res.status(409).json({
                        message: "De wachtwoorden zijn niet identiek.",
                        redirect: false,
                        status: 409,
                    });
                // Check if mail is already in use
                const checkIfExists = await models_1.User.findOne({
                    email: email
                });
                if (checkIfExists)
                    return res.status(409).json({
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.register = async (req, res, next) => {
            try {
                const { email, password, firstName, lastName, role } = req.body;
                const checkIfExists = await models_1.User.findOne({
                    email: email
                });
                if (checkIfExists)
                    return res.status(409).json({
                        message: "This user already exists",
                        redirect: false,
                        status: 409,
                    });
                let createUser = new models_1.User({
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
                        const createCyclistDoc = new models_1.Cyclist({
                            _userId: createUser._id,
                        });
                        await createCyclistDoc.save();
                        break;
                    case "parent":
                        const createParentDoc = new models_1.Parent({
                            _userId: createUser._id,
                        });
                        await createParentDoc.save();
                        break;
                    case "clubmember":
                        const createMemberDoc = new models_1.Member({
                            _userId: createUser._id,
                        });
                        await createMemberDoc.save();
                        break;
                    case "club":
                        const createClubDoc = new models_1.Club({
                            _userId: createUser._id,
                        });
                        await createClubDoc.save();
                        break;
                    default:
                        break;
                }
                ;
                const user = await createUser.save();
                if (!user)
                    return res.status(400).json({
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
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.login = async (req, res, next) => {
            try {
                this.auth.passport.authenticate('local', {
                    session: this.config.auth.jwt.session,
                }, (e, user) => {
                    if (e) {
                        return next(e);
                    }
                    ;
                    if (!user) {
                        return res.status(404).json({
                            message: "Deze gebruiker lijkt niet te bestaan",
                            redirect: false,
                            status: 404,
                        });
                    }
                    ;
                    const token = this.auth.createToken(user);
                    return res.status(200).json({
                        message: "User is logged in",
                        redirect: true,
                        status: 200,
                        token: token,
                    });
                })(req, res, next);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.addPoints = async (req, res, next) => {
            try {
                // Get users id
                const contentToken = this.auth.checkId(req, res);
                const user = await models_1.User.findById(contentToken).exec();
                // Get xp
                const { pts } = req.body;
                if (!user) {
                    return res.status(404).json({
                        message: "User can't be found",
                        redirect: false,
                        status: 404,
                    });
                }
                ;
                const updatedUser = await models_1.User.findByIdAndUpdate(contentToken, {
                    $set: {
                        'cyclist.xp': user.cyclist.pts + pts,
                    },
                }).exec();
                return res.status(200).json(updatedUser);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.getLandingStats = async (req, res, next) => {
            const users = await models_1.User.find().exec();
            const teams = await models_1.User.find({ role: 'club' }).exec();
            const events = await models_1.Event.find().exec();
            const rewards = await models_1.Reward.find().exec();
            return res.status(200).json({
                users: users.length,
                teams: teams.length,
                events: events.length,
                rewards: rewards.length,
            });
        };
        this.auth = auth;
        this.config = config;
    }
    ;
}
exports.default = UserController;
;
//# sourceMappingURL=UserController.js.map