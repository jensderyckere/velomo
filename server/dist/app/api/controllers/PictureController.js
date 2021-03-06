"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
class PictureController {
    constructor() {
        this.showAvatar = (req, res, next) => {
            services_1.Storage.pipeAvatar(req, res);
        };
        this.uploadAvatar = async (req, res, next) => {
            try {
                if (!req.file)
                    return res.status(404).json({
                        message: "Geen afbeelding upgeload",
                        redirect: false,
                        status: 404,
                    });
                return res.status(200).send({
                    filename: req.file.filename,
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
    }
}
exports.default = PictureController;
;
//# sourceMappingURL=PictureController.js.map