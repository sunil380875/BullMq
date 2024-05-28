export type ROLE = "ADMIN" | "USER";
export type createdBy = "ADMIN" | "SELF";
export default interface USER_TYPE extends Document {
  role: ROLE;
  password?: string;
  name: string;
  email: string;
  avatar?: string;
  avatarPath?: string;
  country: string;
  phoneNumber: string;
  city: string;
  signaturePath: string;
  signature: string;
  createdBy: createdBy;
  fcmToken: {
    android: string;
    ios: string;
    web: string;
  };
}
