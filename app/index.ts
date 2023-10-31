import config from "config";
import express, { Express, NextFunction } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./router";
import dotenv from "dotenv";
import { stderrStream, stdoutStream } from "./utils/logger/morgan";
import db from "./db";
import {
  errorDecorator,
  finalErrorHandler,
  notFoundErrorHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler
} from "./utils/errorMiddleware";

dotenv.config();

class Application {
  private static _server: Express;

  public static async startServer(): Promise<void> {
    this._server = express();
    this._server.set("env", process.env.NODE_ENV);
    this._server.set("host", config.get("app.host"));
    this._server.set("port", 3000);
    this._server.set("trust proxy", true);

    this._server.set("view engine", "ejs");

    await this.connectDB();

    // Middlewares
    this._server.use(stderrStream, stdoutStream);
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: true }));
    this._server.use(cookieParser());
    this._server.use(cors());

    // auth
    this._server.use(function(req, res, next) {
      res.locals.authenticated_user = {
        // custom credentials for now
        id: "c0dcbe60-dd6a-4bf6-821f-20a0f39e331f",
        name: "John Doe",
        email: "john@gmail.com",
        wallet_id: "73ace0d7-c9e5-4ce2-b63b-343478a727c2"
      };
      next();
    });

    this._server.use(router);

    // Error handling
    process.on("unhandledRejection", unhandledRejectionHandler);
    process.on("uncaughtException", uncaughtExceptionHandler);
    process.on("SIGTERM", () => {
      process.exit(0);
    });

    this._server.use(notFoundErrorHandler);
    this._server.use(errorDecorator);
    this._server.use(finalErrorHandler);

    const host: string = this._server.get("host");
    const port: number = this._server.get("port");
    this._server.listen(port, host, () => {
      console.log(`Server started at http://${config.get("app.host")}:${config.get("app.port")}`);
    });
  }

  public static async connectDB(): Promise<void> {
    db();
  }
}

Application.startServer();
