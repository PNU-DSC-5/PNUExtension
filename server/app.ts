import express, { NextFunction } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import cors from 'cors';
// routes
import testRouter from './src/users/index';
import userRouter from './src/users/index';

class PNUApi {
  public app : express.Express

  constructor(){
    this.app = express();
    this.initializeAppSettings();
    this.initializeRouters();
  }

  private initializeAppSettings(): void {

    const whiteList = [
      'http://localhost:3003',
      'http://localhost:3000'
     ];
    const corsOptions = {
       origin: whiteList,
       credentials: true,
    };
    this.app.use(cors(corsOptions));

    // this.app.use('*', function(req, res, next) {
    //   //replace localhost:8080 to the ip address:port of your server
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //   res.header('Access-Control-Allow-Headers', 'Content-Type');
    //   res.header('Access-Control-Allow-Credentials', "true");
    //   next(); 
    // });
      
    // //enable pre-flight
    // this.app.options('*', cors());

    // 루트 앱 세팅 적용부
    this.app.use(passport.initialize()); // passport 구동
    this.app.use(passport.session()); // 세션 연결
  }

  private initializeRouters(): void {
    // 라우팅 적용부

    this.app.use('/', testRouter);
    this.app.use('/users', userRouter);

    this.app.use(() => (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
      ) => next(createError(404)));

      interface Err {
        status?: number;
        stack?: string;
        message?: string; 
      }

      this.app.use((
        err: Err, 
        req: express.Request, 
        res: express.Response, 
        next: express.NextFunction
      ) => {
        const serverErrorMessage = 'Internal Server Error';
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        if (err) {
          if (process.env.NODE_ENV === 'development') {
            console.log(err.stack);
          }
        
          res.status(err.status || 500);
          res.send({
            code: err.status,
            message: err.message || serverErrorMessage
          });
        }
      });
    }
}

module.exports = PNUApi;