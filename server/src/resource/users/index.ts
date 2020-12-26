import express, { Request, Response, NextFunction} from 'express';
import doQuery from '../../database/doQuery';
import loginRouter from './login';

const router = express.Router();

router.use('/login', loginRouter);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('test router');
});

export = router;