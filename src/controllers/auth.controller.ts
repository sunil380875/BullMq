import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import {
  Conflict,
  InternalServerError,
  NotFound,
  Unauthorized,
  BadRequest,
} from "http-errors";

import { UserSchema } from "../models";
import {
  EmailService,
  JwtService,
  PasswordHasServices,
  ProducersService,
} from "../services";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";

import bottomMiddleware from "../middleware/bottom.middleware";
import { fieldValidateError } from "../helper/fieldvalidation";
export default class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const checkDuplicate = await UserSchema.findOne({
        $or: [
          {
            email: req.body?.email,
          },
        ],
      });
      // if (checkDuplicate?.email)
      //   throw new Conflict("This email is already exit.");

      const userRegister = await UserSchema.create({
        ...req.body,
      });
      if (!userRegister)
        throw new InternalServerError(
          "Something went wrong, user not created."
        );

      res.json({
        success: {
          message: "User register successfully.",
          data: userRegister,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async registerUsers(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const checkDuplicate = await UserSchema.findOne({
        $or: [
          {
            email: req.body?.email,
          },
        ],
      });
      // if (checkDuplicate?.email)
      //   throw new BadRequest("This email is already exist.");

      const { name, email, password } = req.body;

      // const userRegister = await UserSchema.create({
      //   name,
      //   email,
      //   password,
      // });
      new ProducersService().saveUserQueue({
        name,
        email,
        password,
      });
      // new ProducersService().emailQueue({
      //   email,
      //   subject: "Sign up success",
      //   message: "Have a awesome day",
      // });

      res.json({
        success: {
          message: "User register successfully.",
          // data: userRegister,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      //   fieldValidateError(req);

      let user = await UserSchema.findOne({
        email,
      }).select("+status");

      if (!user) throw new NotFound("Username and password are incorrect.");

      const isPasswordMatch = user.password
        ? await new PasswordHasServices().compare(password, user.password)
        : undefined;

      if (!isPasswordMatch) throw new NotFound("Password is incorrect.");
      const token = await new JwtService().accessTokenGenerator(
        JSON.stringify({
          userId: user._id,
          role: user.role,
          // status: user.status,
        })
      );
      if (!token) throw new Unauthorized("Token generate failed.");
      user.password = undefined;
      res.json({
        success: {
          data: {
            token,
            user,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async self(req: MIDDLEWARE_REQUEST_TYPE, res: Response, next: NextFunction) {
    try {
      const userId = req?.payload?.userId;

      const findUserData: any = await UserSchema.findOne({
        _id: userId,
      }).select("-password -__v ");

      if (!findUserData) throw new NotFound("user is not found");

      res.json({
        success: {
          data: findUserData,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async changePassword(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req?.payload?.userId;
      const { oldPassword, newPassword } = req.body;
      //fieldValidateError(req);
      const user = await UserSchema.findById(userId);

      if (!user) throw new NotFound("Username and password are incorrect.");

      const isPasswordMatch = user.password
        ? await new PasswordHasServices().compare(oldPassword, user.password)
        : undefined;
      if (!isPasswordMatch) throw new NotFound("Password is incorrect.");

      const hashPassword = await new PasswordHasServices().hash(newPassword);

      const updateUser = await UserSchema.findByIdAndUpdate(
        userId,
        {
          password: hashPassword,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateUser)
        throw new NotFound("Something went wrong, Password not updated.");
      res.json({
        success: {
          message: "Password change successfully.",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  // Forget password
  //   async forgetPassword(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { email } = req.body;
  //      // fieldValidateError(req);
  //       const findUser = await UserSchema.findOne({ email });
  //       if (!findUser) throw new NotFound("User not Found.");
  //       const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  //       // crateAndUpdate forget
  //       const createAndUpdate = await ForgetSchema.findOneAndUpdate(
  //         { user: findUser?._id },
  //         {
  //           otp,
  //         },
  //         { runValidators: true, upsert: true }
  //       );
  //       // email send
  //       await new EmailService().emailSend({
  //         emails: email,
  //         subject: "Forget password",
  //         message: `Hi ${findUser?.name}
  //           Important!! Don't share your otp
  //           your otp is ${otp}. OTP valid for 15 minutes.`,
  //       });
  //       const token = await new JwtService().accessTokenGenerator(
  //         JSON.stringify({
  //           userId: findUser._id,
  //           role: findUser.role,
  //           // status: findUser.status,
  //           otp: true,
  //         })
  //       );
  //       if (!token) throw new Unauthorized("Token generate failed.");
  //       res.json({
  //         success: {
  //           message: "OTP is send to your email, Please check your email.",
  //           data: {
  //             token,
  //           },
  //         },
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //   async forgetPasswordOtpVerify(
  //     req: MIDDLEWARE_REQUEST_TYPE,
  //     res: Response,
  //     next: NextFunction
  //   ) {
  //     try {
  //       const { otp, password } = req.body;
  //       fieldValidateError(req);
  //       //const user = req?.payload?.userId;
  //       const findForgetPassword = await ForgetSchema.findOne({ otp: otp });
  //       if (!findForgetPassword?.otp) throw new NotFound("Your otp has expired.");
  //       if (findForgetPassword?.otp !== parseInt(otp))
  //         throw new Conflict("Yor otp is not match.");
  //       const hashPassword = await new PasswordHasServices().hash(password);
  //       const updateUser = await UserSchema.findByIdAndUpdate(
  //         { _id: findForgetPassword.user },
  //         {
  //           password: hashPassword,
  //         },
  //         {
  //           runValidators: true,
  //           new: true,
  //         }
  //       );
  //       if (!updateUser)
  //         throw new NotFound("Something went wrong, Password not set.");
  //       // const deleteForget = await ForgetSchema.findOneAndDelete({ user });
  //       res.json({
  //         success: {
  //           message: "Password set successfully.",
  //         },
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

export const AuthControllerValidator = {
  register: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Password must be at most 50 characters long."),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid mail id")
      // .normalizeEmail()
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long."),

    body("phoneNumber").not().isEmpty().withMessage("phoneNumber is required."),
    body("role").not().isEmpty().exists().withMessage("Role must required."),
  ],
  registerUsers: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Password must be at most 50 characters long."),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid mail id")
      // .normalizeEmail()
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long."),

    body("phoneNumber").not().isEmpty().withMessage("phoneNumber is required."),
  ],
  // oldPassword, newPassword
  changePassword: [
    body("oldPassword").not().isEmpty().withMessage("oldPassword is required."),
    body("newPassword")
      .not()
      .isEmpty()
      .withMessage("newPassword is required.")
      .isLength({ min: 3 })
      .withMessage("newPassword must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("newPassword must be at most 50 characters long."),
  ],
  forgetPassword: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required.")
      .isEmail()
      .withMessage("email is not valid."),
  ],
  // otp, password
  forgetPasswordOtpVerify: [
    body("otp")
      .not()
      .isEmpty()
      .withMessage("otp is required.")
      .isNumeric()
      .withMessage("otp must be number."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required.")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 characters long.")
      .isLength({ max: 50 })
      .withMessage("password must be at most 50 characters long."),
  ],
};
