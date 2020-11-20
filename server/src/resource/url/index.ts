import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';

import { Url } from '../../shared/interfaces/user.interface';
import { Payload } from '../../shared/interfaces/token.interface';
const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query;
 
  if (userId) {
    const sql_getUrls = `
      SELECT * FROM urls
      WHERE urls.userId = ?
      `;

    doQuery(sql_getUrls, [userId])
      .then((row) => {
        console.log('[URL Find] : Success');
        const urls: Url[] = row.result;
        response.Helper.ok(req, res, urls);
      })
      .catch((err) => {
        console.log(err);
        response.Helper.serverError(req, res, err);
      });
  } else {
    response.Helper.serverError(req, res, []);
  }
});

router.post(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    const url: Url = req.body;
    const payload: Payload = req.user as Payload;

    if (url && payload) {
      const sql_addUrl = `
      INSERT INTO urls(urlName, url, userId)
      VALUES(?,?,?)
      `;

      doQuery(sql_addUrl, [url.name, url.url, payload.id])
        .then(() => {
          console.log('[URL Add] : Success');
          response.Helper.ok(req, res, true);
        })
        .catch((err) => {
          console.log(err);
          response.Helper.badRequest(req, res, [err]);
        });
    } else {
      response.Helper.badRequest(req, res, []);
    }
  },
);

router.delete(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    const url: Url = req.body;
    const payload: Payload = req.user as Payload;

    if (url && payload) {
      const sql_deleteUrl = `
      DELETE FROM urls 
      WHERE urls.index = ? AND urls.userId = ?;
      `;

      doQuery(sql_deleteUrl, [url.index, url.userId])
        .then(() => {
          console.log('[URL Delete] : Success');
          response.Helper.ok(req, res, true);
        })
        .catch((err) => {
          console.log(err);
          response.Helper.badRequest(req, res, [err]);
        });
    } else {
      response.Helper.badRequest(req, res, []);
    }
  },
);

export = router;
