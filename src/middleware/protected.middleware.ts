import { NextFunction, Response } from "express";
import { Locked, Unauthorized } from "http-errors";
import { UserSchema } from "../models";
import { JwtService } from "../services";

import { MIDDLEWARE_REQUEST_TYPE } from "../types";

export default class ProtectedMiddleware extends JwtService {
  public async protected(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.headers["authorization"]) throw new Unauthorized("Unauthorized");

      const token = req?.headers?.["authorization"].split(" ")[1];

      // const token = req?.cookies?.token;
      if (!token) throw new Unauthorized("Unauthorized");
      const payload = super.accessTokenVerify(token);
      //   accessTokenVerify(token);

      if (!payload?.aud) throw new Unauthorized("Unauthorized");
      let objectCreate = JSON.parse(payload.aud);
      if (!objectCreate.userId) throw new Unauthorized("Unauthorized");
      const findUserStatus = await UserSchema.findById(
        objectCreate.userId
      ).select("status");
      if (!findUserStatus) throw new Unauthorized("Unauthorized");

      // if (findUserStatus?.status !== "ACTIVE")
      //   throw new Locked("You are block by your higher authority.");
      req.payload = objectCreate;

      next();
    } catch (error) {
      next(error);
    }
  }
}
