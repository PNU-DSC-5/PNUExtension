import express, { Request, Response, NextFunction} from 'express' // 1
const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Test Success');
});

export = router;