import { Router } from "express";
import { AuthController } from "../controllers";
import { ProtectedMiddleware } from "../middleware";

export default class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  private protectedMiddleware: ProtectedMiddleware;
  public path = "auth";

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.protectedMiddleware = new ProtectedMiddleware();
    this.routes();
  }
  private routes() {
    // Signup Admin
    this.router.post(
      "/signup",

      this.authController.register
    );
    //SIGNUP Users
    this.router.post(
      "/signup-user",

      this.authController.registerUsers
    );
    // signIn
    this.router.post(
      "/signin",

      this.authController.signin
    );
    this.router.post(
      "/change-password",

      this.protectedMiddleware.protected,
      this.authController.changePassword
    );
    this.router.get(
      "/self",
      this.protectedMiddleware.protected,
      this.authController.self
    );
    // this.router.post(
    //   "/forget-password-otp-send",

    //   this.authController.forgetPassword
    // );
    // this.router.post(
    //   "/forget-password-otp-verify",

    //   this.authController.forgetPasswordOtpVerify
    // );
  }
}
