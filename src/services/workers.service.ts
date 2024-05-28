import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import EmailService from "./email.service";
import { UserSchema } from "../models";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

class WorkerService {
  public async emailQueue() {
    const worker = new Worker(
      "email_send",
      async (job) => {
        // console.log(job.data);

        await new EmailService().emailSend({
          emails: job.data.email,
          subject: job.data.subject,
          message: job.data.message,
        });
      },
      {
        connection: connection,
      }
    );
  }
  public async SaveUserQueue() {
    const workerTwo = new Worker(
      "save_user",
      async (job) => {
        console.log(job.data, "received");
        const userRegister = await UserSchema.create({
          name: job.data.name,
          email: job.data.email,
          password: job.data.password,
        });
      },
      {
        connection: connection,
      }
    );
  }
}

export default WorkerService;
