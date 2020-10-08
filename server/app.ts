import express, { NextFunction } from 'express';
import createError from 'http-errors';

// routes
import testRouter from './routes/index';

class PNUApi {
  public app : express.Express

  constructor(){
    this.app = express();
    this.initializeAppSettings();
    this.initializeRouters();
  }

  private initializeAppSettings(): void {
    // 루트 앱 세팅 적용부

  }

  private initializeRouters(): void {
    // 라우팅 적용부

    this.app.use('/', testRouter);

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