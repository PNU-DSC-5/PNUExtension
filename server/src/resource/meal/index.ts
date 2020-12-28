import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import response from '../../middleware/responseHelper/helper';

import { Meal } from '../../shared/interfaces/meal.interface';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('[Meal FindAll] : Start ... ');
  const sql_findAllMael = `
    SELECT * 
    FROM meal
    `;
  doQuery(sql_findAllMael, [])
    .then((row) => {
      if (row.result[0]) {
        try {
          const mealPlanner: Meal[] = row.result;
          console.log('[Meal FindAll] : Success ... ');
          response.Helper.ok(req, res, mealPlanner);
        } catch (err) {
          console.log('[Meal FindAll] : Error ... ', err);
          response.Helper.serverError(req, res, err);
        }
      }
      })
      .catch((err) => {
        console.log('[Meal FindAll] : Error ... ');
        response.Helper.mysqlError(req, res, err);
      });
});

export = router;
