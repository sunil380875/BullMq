import { Request, Response, NextFunction } from "express";

export default class AddressController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.send("Hello");
    } catch (err) {
      next(err);
    }
  }
}
