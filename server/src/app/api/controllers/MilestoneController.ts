import { Request, Response, NextFunction } from "express";
import { Auth } from "../../services";

export default class MilestoneController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  checkProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      return
    } catch (e) {
      next(e);
    };
  };
};
