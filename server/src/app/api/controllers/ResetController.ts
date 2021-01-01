import { Request, Response, NextFunction } from "express";
import { default as crypto } from "crypto";
import { default as bcrypt } from "bcrypt";
import { default as nodemailer } from "nodemailer";

import { IConfig } from "../../services";
import { IReset, IUser, Reset, User } from "../models";

export default class ResetController {
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
    };

    send = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { email } = req.body;

            const user = await User.findOne({email: email});
    
            if (!user) return res.status(404).json({
                message: "This user does not exist",
                redirect: false,
                status: 404,
            });

            const token = await Reset.findOne({_userId: user._id});

            if (token) return res.status(400).json({
                message: "There has already been token made",
                redirect: false,
                status: 400,            
            });

            const newToken: IReset = new Reset({
                _userId: user._id,
                token: crypto.randomBytes(64).toString('hex'),
                _expiresAt: Date.now(),
            });

            const preparedToken = await newToken.save();

            const transporter = nodemailer.createTransport({
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

            if (!info) return res.status(400).json({
                message: "Mail can't be send",
                status: 400,
                redirect: false,
            });

            return res.status(200).json({
                message: "Mail has been send",
                status: 200,
                redirect: true,
            });
        } catch (e) {
            next(e);
        };
    };

    submit = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { token, password } = req.body;
            
            const reset = await Reset.findOne({token: token});

            if (!reset) return res.status(404).json({
                message: "This resettoken can't be found",
                status: 404,
                redirect: false,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return res.status(400).json({
                        message: "Password could not change",
                        status: 500,
                        redirect: false,
                    });
                    
                    await User.findByIdAndUpdate({
                        _id: reset._userId,
                    }, {
                        password: hash,
                    });

                    await Reset.findOneAndRemove({
                        _id: reset._id,
                    });

                    return res.status(200).json({
                        message: "The user's password has been changed",
                        redirect: true,
                        status: 200,
                    });            
                });
            });
        } catch (e) {
            next(e);
        };
    };
};