import { model, Model, Schema } from "mongoose";
import { PasswordHasServices } from "../services";
import { USER_TYPE } from "../types";

const userSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    password: {
      type: String,
      minlength: [4, "Password should be atleast 4 characters long"],
      maxlength: [100, "Password should be atmost 100 characters long"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
      // unique: true,
      type: String,
      index: true,
    },

    avatar: {
      type: String,
    },
    avatarPath: {
      type: String,
    },

    role: {
      type: String,
      enum: {
        values: ["ADMIN", "USER"],
        message: `Role value must be  ADMIN or USER any one of them.`,
      },
      default: "USER",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
).pre<USER_TYPE>("save", async function (next) {
  this.password = this.password
    ? await new PasswordHasServices().hash(this.password)
    : undefined;
  // video uid create

  next();
});

const UserSchema = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);
UserSchema.syncIndexes();
export default UserSchema;
