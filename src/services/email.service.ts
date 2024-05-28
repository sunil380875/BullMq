import nodemailer from "nodemailer";
import { email, email_host, email_pass, email_user } from "../config";
const template = require("../template");
export default class EmailService {
  public emailSend({
    emails,
    subject,
    message,
    link,
  }: {
    emails: string;
    subject: string;
    message: string;
    link?: string;
  }): any {
    const emailCredentials = {
      from: `noreply@coderskm.com`,
      to: emails,
      subject: subject,
      html: template.normalMailBody(message),
    };
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport({
        host: email_host,
        port: 2525,
        auth: {
          user: email_user,
          pass: email_pass,
        },
      });
      transport
        .sendMail(emailCredentials)
        .then((info) => {
          return resolve(info);
        })
        .catch((err) => {
          return resolve(0);
        });
    });
  }
}
