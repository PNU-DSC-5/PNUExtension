import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';

import { SchoolClass } from '../../shared/interfaces/schoolClass.interface';
import { User } from '../../shared/interfaces/user.interface';

const router = express.Router();

router.get('/', JwtToken.check, (req: Request, res: Response, next: NextFunction) => {
  console.log('[School Classes FindAll] : Start ... ');
  if (req.user) {
    const user = req.user as User;
    const sql_findAllSchoolClass = `
    SELECT * FROM classes
    WHERE userId = ?
    `;
    doQuery(sql_findAllSchoolClass, [user.id])
      .then((row) => {
        if (row.result[0]) {
          try {
            const userClasses: SchoolClass[] = row.result;
            console.log('[School Classes FindAll] : Success ... ');
            response.Helper.ok(req, res, userClasses);
          } catch (err) {
            console.log('[School Classes FindAll] : Error ... ', err);
            response.Helper.serverError(req, res, err);
          }
        }
      })
      .catch((err) => {
        console.log('[School Classes FindAll] : Error ... ');
        response.Helper.mysqlError(req, res, err);
      });
  }
});

router.post(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user = req.user as User;
      const newClass = req.body.newClass as SchoolClass;
      console.log('[School Classes Insert] : Start ... ', user.id);

      const sql_addSchoolClass = `
      INSERT INTO classes(userId, 연번,대학명,주관학과명,학년,교과목코드,분반,교과목명,교과구분,
      영문교과목명,학점,이론,실습,교수명,제한인원,시간표,원격,교양영역)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const sql_addData = [user.id, newClass.연번, newClass.대학명, newClass.주관학과명, newClass.학년, newClass.교과목코드,
        newClass.분반, newClass.교과목명, newClass.교과구분, newClass.영문교과목명, newClass.학점, newClass.이론, newClass.실습,
        newClass.교수명, newClass.제한인원, newClass.시간표, newClass.원격, newClass.교양영역,
      ];
      doQuery(sql_addSchoolClass, sql_addData)
        .then(() => {
          console.log('[School Classes Insert] : Success ... ');
          response.Helper.ok(req, res, true);
        })
        .catch((err) => {
          console.log('[School Classes Insert] : Error ... ');
          response.Helper.mysqlError(req, res, err);
        });
    }
  },
);

router.delete(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const newClass = req.body.newClass as SchoolClass;
    console.log('[School Classes Delete] : Start ... ', newClass.교과목명);

    if (newClass && user) {
      console.log('[School Classes Delete] : Success ... ');
      response.Helper.ok(req, res, true);
    } else {
      response.Helper.badRequest(req, res, []);
    }
  },
);

export = router;
