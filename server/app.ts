import express, { NextFunction } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

    this.app.use((req, res, next) => {  
      res.setHeader('Access-Control-Allow-Origin', "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
      next();
    });

    /* http 통신 origin Url 설정 -> cors 옵션 설정 */
    const whiteList = [
      'http://localhost:3003',
      'http://localhost:3000'
     ];
    
    const corsOptions = {
       origin: whiteList,
       credentials: true,
    };
    
    this.app.use(cors(corsOptions));

    
    this.app.use(cookieParser());

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