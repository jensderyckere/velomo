import { Request, Response, NextFunction } from "express";
import { Auth } from "../../services";

export default class ChallengeController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };
};
