"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Models
const models_1 = require("../models");
class PopupController {
    constructor(auth) {
        this.viewAllPopups = async (req, res, next) => {
            try {
                // Get all popups from one user
                const userId = this.auth.checkId(req, res);
                const popups = await models_1.Popup.find({
                    _userId: userId,
                    seen: false
                }).exec();
                if (!popups)
                    return res.status(200).json(null);
                return res.status(200).json(popups);
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.viewedPopup = async (req, res, next) => {
            try {
                // Get popup id
                const { id } = req.params;
                // Update popup
                const popup = await models_1.Popup.findByIdAndUpdate(id, {
                    $set: {
                        seen: true
                    },
                }).exec();
                // Update user
                const userId = this.auth.checkId(req, res);
                const user = await models_1.User.findById(userId).exec();
                const xp = user.cyclist.pts + popup.addedPt;
                let level_name = '';
                let level = 0;
                // Calculate progress and edit user
                if (xp >= 0 && xp < 1000) {
                    level = 0;
                    level_name = 'Potentieel';
                }
                ;
                if (xp >= 1000 && xp < 4000) {
                    level = 1;
                    level_name = 'Ijzersterke toerist';
                }
                ;
                if (xp >= 4000 && xp < 10000) {
                    level = 2;
                    level_name = 'Krachtige waterdrager';
                }
                ;
                if (xp >= 10000 && xp < 25000) {
                    level = 3;
                    level_name = 'Betrouwbare knecht';
                }
                ;
                if (xp >= 25000 && xp < 45000) {
                    level = 4;
                    level_name = 'Solo artiest';
                }
                ;
                if (xp >= 45000 && xp < 70000) {
                    level = 5;
                    level_name = 'Publiekslieveling';
                }
                ;
                if (xp >= 70000 && xp < 100000) {
                    level = 6;
                    level_name = 'Veelwinnaar';
                }
                ;
                if (xp >= 100000 && xp < 150000) {
                    level = 7;
                    level_name = 'Internationale ster';
                }
                ;
                if (xp >= 150000 && xp < 250000) {
                    level = 8;
                    level_name = 'Wielergod';
                }
                ;
                const updatedUser = await models_1.User.findByIdAndUpdate(userId, {
                    $set: {
                        'cyclist.level': level,
                        'cyclist.level_name': level_name,
                        'cyclist.xp': xp,
                    },
                }).exec();
                return res.status(200).json(updatedUser);
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
exports.default = PopupController;
;
//# sourceMappingURL=PopupController.js.map