import { Request, Response, NextFunction } from "express";
import { Storage } from "../../services";

export default class PictureController {
  public showAvatar = (req: Request, res: Response, next: NextFunction) => {
    Storage.pipeAvatar(req, res);
  };

  public uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      if (!req.file) return res.status(404).json({
        message: "Geen afbeelding upgeload",
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