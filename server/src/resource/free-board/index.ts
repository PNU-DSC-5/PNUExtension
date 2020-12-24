import express, { Request, Response, NextFunction } from 'express';
import { add } from 'winston';
import doQuery from '../../database/doQuery';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';

import { User } from '../../shared/interfaces/user.interface';
import { FreeBoard } from '../../shared/interfaces/freeBoard.interface';
import { FreeBoardPost } from '../../shared/dto/freeBoardPost.dto';
import { FreeBoardPatch } from '../../shared/dto/freeBoardPatch.dto';
import { FreeBoardDelete } from '../../shared/dto/freeBoardDelete.dto';
import { FreeBoardViewCount } from '../../shared/dto/freeBoardViewCount.dto';

const router = express.Router();

/** 
 * 로그인 여부 상관 없이 모든 게시판 정보 조회
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('[Free Board Data FindAll] : Start ... ');

  const sql_findAll = `
  SELECT * FROM freeboard
  `;
  doQuery(sql_findAll, [])
    .then((row) => {
      console.log('[Free Board Data FindAll] : Success ... ');
      const resultData: FreeBoard[] = row.result as FreeBoard[];
      response.Helper.ok(req, res, resultData);
    })
    .catch((err) => {
      response.Helper.mysqlError(req, res, err);
    });
});

/** 
 * 로그인 필요, 특정 게시물 정보 조회
 */
router.get('/each', JwtToken.check, (req: Request, res: Response, next: NextFunction) => {
  console.log('[Free Board Data Find One] : Start ... ');
});

/** 
 * 게시물 등록
 */
router.post(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('[Free Board Data Add One] : Start ... ');
    try {
      const user = req.user as User;
      const addData = req.body as FreeBoardPost;
      if (user.id) {
        const sql_add = `
        INSERT INTO freeboard(userId,userName,title,content,createdAt,likes,views,category,tag,isSecret) 
        VALUES(?,?,?,?,?,?,?,?,?,?)
        `;
        /**
         * 주의!
         * mysql 의 예약어를 절대 컬럼명으로 써서는 안된다
         * 쿼리를 보낼 때 예약어가 순차 실행되어 에러를 반환한다.
         * (혹은 예기치 않은 문제를 발생 시킨다.)
         */
        const sql_data = [
          user.id, user.name, addData.title,
          addData.content, new Date(addData.createdAt), addData.likes, addData.views,
          addData.category ? addData.category : '기타',
          addData.tag ? addData.tag : '기타',
          addData.isSecret
        ];

        doQuery(sql_add, sql_data)
          .then(() => {
            console.log('[Free Board Data Add One] : Success ..  ');
            response.Helper.ok(req, res, true);
          })
          .catch((err) => {
            console.log('[Free Board Data Add One] : Mysql Error ... \n', err);
            response.Helper.mysqlError(req, res, err);
          });
      }
    } catch (err) {
      console.log('[Free Board Data Add One] : Error ... \n', err);
      response.Helper.serverError(req, res, err);
    }
  }
);

/**
 * 자신의 게시물 수정
 */
router.patch(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('[Free Board Data Update One] : Start ... ');

    try {
      const user = req.user as User;
      const updateData = req.body as FreeBoardPatch;

      if (user) {
        const sql_update = `
      UPDATE freeboard
      SET title = ?, content = ?, category = ?, tag = ?, views =? ,likes =?,isSecret=?
      WHERE _index = ?`;

        const sql_data = [
          updateData.title, updateData.content, updateData.category,
          updateData.tag, updateData.views, updateData.likes, updateData.isSecret,
          updateData._index
        ];

        doQuery(sql_update, sql_data)
          .then(() => {
            console.log('[Free Board Data Update One] : Success ..  ');
            response.Helper.ok(req, res, true);
          })
          .catch((err) => {
            console.log('[Free Board Data Update One] : Mysql Error ..  \n', err);
            response.Helper.mysqlError(req, res, err);
          });
      } else {
        response.Helper.unauthorized(req, res);
      }
    } catch (err) {
      response.Helper.serverError(req, res, err);
    }
  }
);

/**
 * 게시물 삭제
 */
router.delete(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('[Free Board Data Delete One] : Start ... ');
    try{
      const user = req.user as User;
      const deleteData = req.body as FreeBoardDelete;

      if(user){
       const sql_delete= `
       DELETE FROM freeboard 
       WHERE freeboard._index = ? AND freeboard.userId = ?`;

       const sql_data = [
         deleteData._index, user.id
       ];

       doQuery(sql_delete, sql_data)
         .then(() => {
           console.log('[Free Board Data Delete One] : Success ..  ');
           response.Helper.ok(req,res,true);
         })
         .catch((err) => {
           console.log('[Free Board Data Delete One] : Mysql Error ..  \n',err);
           response.Helper.mysqlError(req,res,err);
         })
      }else{
        response.Helper.unauthorized(req,res);
      }
     } catch(err) {
       response.Helper.serverError(req,res,err);
     }
  }
);

/**
 * 게시물 조회수 업데이트
 */
router.patch(
  '/view-count',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.body as FreeBoardViewCount;
      const sql_addViewCount = `
      UPDATE freeboard
      SET views = ?
      WHERE _index = ?
      `;

      doQuery(sql_addViewCount, [target.views + 1, target._index])
        .then(() => {
          console.log('[Free Board ++ ViewCount] ... ');
          response.Helper.ok(req, res, true);
        })
        .catch((err) => {
          response.Helper.mysqlError(req, res, err);
        });
    } catch (err) {
      response.Helper.serverError(req, res, err);
    }
  }
);

/**
 * 게시물 좋아요 업데이트
 */
router.patch(
  '/like-count',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.body as FreeBoardViewCount;
      const sql_chageLikeCount = `
      UPDATE freeboard
      SET views = ?
      WHERE _index = ?
      `;

      doQuery(sql_chageLikeCount, [target.views + 1, target._index])
        .then(() => {
          console.log('[Free Board ++ ViewCount] ... ');
          response.Helper.ok(req, res, true);
        })
        .catch((err) => {
          response.Helper.mysqlError(req, res, err);
        });
    } catch (err) {
      response.Helper.serverError(req, res, err);
    }
  }
);

export = router;
