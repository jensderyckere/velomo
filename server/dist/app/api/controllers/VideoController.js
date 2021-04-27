"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
class VideoController {
    constructor() {
        this.showVideo = (req, res, next) => {
            services_1.Storage.pipeVideo(req, res);
        };
        this.uploadVideo = async (req, res, next) => {
            try {
                if (!req.file)
                    return res.status(404).json({
                        message: "Geen video upgeload",
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
exports.default = VideoController;
;
//# sourceMappingURL=VideoController.js.map