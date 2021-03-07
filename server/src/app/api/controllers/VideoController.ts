import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Storage
} from "../../services";

export default class VideoController {
  public showVideo = (req: Request, res: Response, next: NextFunction) => {
    Storage.pipeVideo(req, res);
  };

  public uploadVideo = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      if (!req.file) return res.status(404).json({
        message: "Geen video upgeload",
        redirect: false,
        status: 404,
      });

      return res.status(200).send({
        filename: req.file.filename,
      });
    } catch (e) {
      next(e);
    };
  };
};