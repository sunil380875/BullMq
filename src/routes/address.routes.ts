import { Router } from "express";
import { AddressController } from "../controllers";

export default class Address {
  public router: Router;
  private addressController: AddressController;
  public path = "address";
  constructor() {
    this.router = Router();
    this.addressController = new AddressController();
    this.routes();
  }
  private routes() {
    this.router.get("/new", (req, res) => {
      res.send("Hello Word");
    });
  }
}
