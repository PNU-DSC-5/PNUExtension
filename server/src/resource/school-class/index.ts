import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';

import { SchoolClass } from '../../shared/interfaces/schoolClass.interface';
import { User } from '../../shared/interfaces/user.interface';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send();
});

router.post(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user = req.user as User;
      const newClass = req.body.newClass as SchoolClass;
      console.log('[School Classes Insert] : Start ... ', user.id);
      // console.log(newClass);

      const sql_addSchoolClass = `
    INSERT INTO classes(연번,대학명,주관학과명,학년,교과목코드,분반,교과목명,교과구분,
      영문교과목명,학점,이론,실습,교수명,제한인원,시간표,원격,교양영역)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    
    }

    res.send();
  },
);

export = router;
