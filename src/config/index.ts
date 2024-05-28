import "dotenv/config";
export const port = Number(process.env.PORT);
export const connectionDB = String(process.env.DATABASE_URL);
export const email = String(process.env.EMAIL);
export const accessSecret = String(process.env.ACCESS_SECRET);
export const Storage = String(process.env.STORAGE);
export const accessKey = String(process.env.AWS_ACCESS_KEY);
export const bucketName = String(process.env.BUCKET_NAME);
export const cloudFontDistribution = String(
  process.env.CLOUD_FRONT_DISTRIBUTION_ID
);
export const region = String(process.env.BUCKET_REGION);
export const secretKey = String(process.env.AWS_SECRET_KEY);
export const cloudFont = String(process.env.CLOUD_FRONT_URL);
export const email_host = String(process.env.HOST);
export const email_user = String(process.env.EMAIL_USER);
export const email_pass = String(process.env.EMAIL_PASS);
