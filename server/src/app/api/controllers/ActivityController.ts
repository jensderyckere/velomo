import { Request, Response, NextFunction } from "express";

export default class ActivityController {
  uploadActivity = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    console.log(req.body);
    return res.status(200);
  };
};
