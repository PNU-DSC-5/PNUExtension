import express, { Request, Response, NextFunction} from 'express';
import doQuery from '../../database/doQuery';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('url router');
});

export = router;