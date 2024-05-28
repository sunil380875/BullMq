import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  username: "default",
  password: "default",
});

// Create a Queue with the Redis connection
const myQueue = new Queue("email_send", {
  connection: connection,
});
const myQueueSaveUser = new Queue("save_user", {
  connection: connection,
});

class ProducersService {
  public async emailQueue({
    email,
    subject,
    message,
  }: {
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      await myQueue.add("sendingmail", { email, subject, message });
      //   console.log("Job added to the queue successfully.");
    } catch (error) {
      console.error("Error adding job to the queue:", error);
    }
  }
  public async saveUserQueue({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    try {
      await myQueueSaveUser.add("save user", { email, name, password });
      //   console.log("Job added to the queue successfully.");
    } catch (error) {
      console.error("Error adding job to the queue:", error);
    }
  }
}

export default ProducersService;
