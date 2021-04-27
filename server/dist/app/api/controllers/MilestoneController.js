"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class MilestoneController {
    constructor(auth) {
        this.calculateMyProgressAndShow = async (req, res, next) => {
            try {
                // Arrays
                let arrayOfMilestones = [];
                // Check user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                const allActivities = await models_1.Activity.find({
                    _userId: userId
                }).exec();
                for (let i = 0; i < user.cyclist._milestoneIds.length; i++) { }
                ;
                return res.status(200).json(user);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.auth = auth;
    }
    ;
}
exports.default = MilestoneController;
;
//# sourceMappingURL=MilestoneController.js.map