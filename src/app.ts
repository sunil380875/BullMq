import express, { Application } from "express";
// import { port, connectionDB } from "./config";
import fs from "fs";
import { createServer } from "http";
import path from "path";
// import { Queue, Worker } from "bullmq";
// import IORedis from "ioredis";
import { WorkerService } from "../src/services";
// const connection = new IORedis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });
import { Database } from "./db";
// import { WorkerService } from "../src/services";
class App {
  public app: Application;
  constructor() {
    // socketChat()
    new Database();
    this.app = express();
    // this.emailQueue();
    new WorkerService().emailQueue();
    new WorkerService().SaveUserQueue();
  }
  public listen(appInt: { port: number }) {
    const server = createServer(this.app);

    server.listen(appInt.port, (): void => {
      const middleware = fs.readdirSync(path.join(__dirname, "/middleware"));
      this.middleware(middleware, "top."); // top middleware
      this.routes(); //routes
      this.middleware(middleware, "bottom."); // bottom middleware

      console.log(`\nServer:🚀🚀\n`);
      console.log(`http://localhost:${appInt.port}/api/v1`);
      console.log(`\n🔥🔥:Running\n`);
    });
  }
  // application apply concept
  private middleware(middleware: any[], st: "bottom." | "top.") {
    middleware.forEach((middle) => {
      if (middle.includes(st)) {
        import(path.join(__dirname + "/middleware/" + middle)).then(
          (middleReader) => {
            new middleReader.default(this.app);
          }
        );
      }
    });
  }
  // route apply concept
  private routes() {
    const subRoutes = fs.readdirSync(path.join(__dirname, "/routes"));
    subRoutes.forEach((file: any): void => {
      if (file.includes(".routes.")) {
        import(path.join(__dirname + "/routes/" + file)).then((route) => {
          const rootPath = `/api/v1/${new route.default().path}`;
          console.log(`http://localhost:8081${rootPath}`);
          this.app.use(rootPath, new route.default().router);
        });
      }
    });
  }
  public emailQueue() {
    // const worker = new Worker(
    //   "email_send",
    //   async (job) => {
    //     console.log(job.data);
    //   },
    //   {
    //     connection: connection,
    //   }
    // );
  }
}

export default App;
