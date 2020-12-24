import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import response from '../../middleware/responseHelper/helper';

import { Card } from '../../shared/interfaces/card.interface';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('[Card FindAll] : Start ... ');
  const sql_findAllCard = `
    SELECT * 
    FROM info
    `;
  doQuery(sql_findAllCard, [])
    .then((row) => {
      if (row.result[0]) {
        try { 
          const crawlingCard: Card[] = row.result;
          console.log('[Card FindAll] : Success ... ');
          response.Helper.ok(req, res, crawlingCard);
        } catch (err) {
          console.log('[Card FindAll] : Error ... ', err);
          response.Helper.serverError(req, res, err);
        }
      })
      .catch((err) => {
        console.log('[Cards FindAll] : Error ... ');
        response.Helper.mysqlError(req, res, err);
      });
});
 
export = router;
