"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class NotificationController {
    constructor(auth) {
        this.getNotifications = async (req, res, next) => {
            try {
                // Get user
                const userId = this.auth.checkId(req, res);
                const notifications = await models_1.Notification.find({ _receiverId: userId }).sort({ _createdAt: -1 }).populate({ path: '_senderId' }).exec();
                if (!notifications)
                    return res.status(200).json([]);
                return res.status(200).json(notifications);
            }
            catch (error) {
                next(error);
            }
            ;
        };
        this.viewNotification = async (req, res, next) => {
            try {
                // Get id of notification
                const { id } = req.params;
                const notification = await models_1.Notification.findByIdAndUpdate(id, {
                    $set: {
                        viewed: true,
                    },
                }).exec();
                return res.status(200).json(notification);
            }
            catch (error) {
                next(error);
            }
            ;
        };
        this.auth = auth;
    }
    ;
}
exports.default = NotificationController;
;
//# sourceMappingURL=NotificationController.js.map