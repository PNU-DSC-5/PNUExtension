import express, { NextFunction } from "express";
import createError from "http-errors";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

// routes
import userRouter from './src/resource/users/index';
import urlRouter from './src/resource/url/index';
import schoolClassRouter from './src/resource/school-class/index';

import infoCardRouter from './src/resource/info-card/index';
import newsCardRouter from './src/resource/news-card/index';
import contestCardRouter from './src/resource/contest-card/index';

import freeBoardRouter from './src/resource/free-board/index';
import notificationRouter from './src/resource/notifications/index';
// import testRouter from './src/resource/users/index';
import testRouter from './src/resource/users/index';

class PNUApi {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.initializeAppSettings(); 
    this.initializeRouters();
  }

  private initializeAppSettings(): void {
    this.app.use(express.static(path.join(__dirname, 'client/build')));
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "authorization, content-type"
      );
      next();
    });

    /* http 통신 origin Url 설정 -> cors 옵션 설정 */
    const whiteList = ["http://localhost:3003", "http://localhost:3000"];

    const corsOptions = {
      origin: whiteList,
      credentials: true
    };

    this.app.use(cors(corsOptions));

    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));

    // 루트 앱 세팅 적용부
    this.app.use(passport.initialize()); // passport 구동
    this.app.use(passport.session()); // 세션 연결
  }

  private initializeRouters(): void {
    // 라우팅 적용부

    this.app.use('/', testRouter);
    this.app.use("/users", userRouter);
    this.app.use("/url", urlRouter);
    this.app.use("/school-class", schoolClassRouter);

    this.app.use("/info-card", infoCardRouter);
    this.app.use("/news-card", newsCardRouter);
    this.app.use("/contest-card", contestCardRouter);

    this.app.use("/free-board", freeBoardRouter);
    // this.app.use("/card", cardRouter);
    this.app.use("/notification", notificationRouter);

    this.app.use(
      () => (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => next(createError(404))
    );

    interface Err {
      status?: number;
      stack?: string;
      message?: string;
    }

    this.app.use(
      (
        err: Err,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const serverErrorMessage = "Internal Server Error";
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
        if (err) {
          if (process.env.NODE_ENV === "development") {
            console.log(err.stack);
          }

          res.status(err.status || 500);
          res.send({
            code: err.status,
            message: err.message || serverErrorMessage
          });
        }
      }
    );
  }
}

// module.exports = PNUApi;

export default PNUApi;