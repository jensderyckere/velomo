"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const models_1 = require("../models");
class ResetController {
    constructor(config) {
        this.send = async (req, res, next) => {
            try {
                const { email } = req.body;
                const user = await models_1.User.findOne({
                    email: email
                });
                if (!user)
                    return res.status(404).json({
                        message: "This user does not exist",
                        redirect: false,
                        status: 404,
                    });
                const token = await models_1.Reset.findOne({
                    _userId: user._id
                });
                if (token)
                    return res.status(400).json({
                        message: "There has already been token made",
                        redirect: false,
                        status: 400,
                    });
                const newToken = new models_1.Reset({
                    _userId: user._id,
                    token: crypto_1.default.randomBytes(64).toString('hex'),
                    _expiresAt: Date.now(),
                });
                const preparedToken = await newToken.save();
                const transporter = nodemailer_1.default.createTransport({
                    host: this.config.mailer.host,
                    port: this.config.mailer.port,
                    secure: this.config.mailer.secure,
                    auth: {
                        user: this.config.mailer.mail,
                        pass: this.config.mailer.pass,
                    },
                });
                const info = await transporter.sendMail({
                    from: `"Velomo" <${this.config.mailer.mail}>`,
                    to: email,
                    subject: "Je wou je wachtwoord aanpassen",
                    html: `<p>Via volgende link kan je je wachtwoord aanpassen: <a href="http://localhost:3000/reset/${preparedToken.token}" target="_blank">http://localhost:3000/reset/${preparedToken.token}</a></p>`
                });
                if (!info)
                    return res.status(400).json({
                        message: "Mail can't be send",
                        status: 400,
                        redirect: false,
                    });
                return res.status(200).json({
                    message: "Mail has been send",
                    status: 200,
                    redirect: true,
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.submit = async (req, res, next) => {
            try {
                const { token, password } = req.body;
                const reset = await models_1.Reset.findOne({
                    token: token
                });
                if (!reset)
                    return res.status(404).json({
                        message: "This resettoken can't be found",
                        status: 404,
                        redirect: false,
                    });
                bcrypt_1.default.genSalt(10, (err, salt) => {
                    bcrypt_1.default.hash(password, salt, async (err, hash) => {
                        if (err)
                            return res.status(400).json({
                                message: "Password could not change",
                                status: 500,
                                redirect: false,
                            });
                        await models_1.User.findByIdAndUpdate({
                            _id: reset._userId,
                        }, {
                            password: hash,
                        });
                        await models_1.Reset.findOneAndRemove({
                            _id: reset._id,
                        });
                        return res.status(200).json({
                            message: "The user's password has been changed",
                            redirect: true,
                            status: 200,
                        });
                    });
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.config = config;
    }
    ;
}
exports.default = ResetController;
;
//# sourceMappingURL=ResetController.js.map