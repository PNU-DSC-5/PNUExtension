import express, { Request, Response, NextFunction } from "express";
import doQuery from "../../database/doQuery";
import JwtToken from "../../middleware/jwt/jwtToken";
import response from "../../middleware/responseHelper/helper";

import { Payload } from "../../shared/interfaces/token.interface";
import { User } from "../../shared/interfaces/user.interface";
import { Notification } from "../../shared/interfaces/notification.interface";
import { NotificationPatch } from "../../shared/dto/notificationPatch.dto";

const router = express.Router();

/**
 * 알림 GET 라우터
 * @since 12/13
 * 상위 20 개 까지만? 들고온다. 해보고 수정하기
 */
router.get(
  "/",
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user = req.user as User;

      const sql_findNotifications = `
      SELECT * FROM notifications
      WHERE userId = ?
      ORDER BY createdAt
      `;

      doQuery(sql_findNotifications, [user.id])
        .then((row) => {
          try {
            const notifications = row.result as Notification[];

            response.Helper.ok(req, res, notifications);
          } catch (err) {
            response.Helper.serverError(req, res, err);
          }
        })
        .catch((err) => {
          response.Helper.mysqlError(req, res, err);
        });
    }
  }
);

router.post(
  "/",
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const user = req.user as User;
      const newNotification = req.body as Notification;

      const sql_addNewNotification = `
      INSERT INTO notifications(title, content, userId, noticeAt, createdAt, isRead, isRemoved, isImportant)
      VALUES(?,?,?,?,?,?,?,?)
      `;

      const sql_data = [
        newNotification.title,
        newNotification.content,
        user.id,
        newNotification.noticeAt,
        newNotification.createdAt,
        false,
        false,
        false,
      ];

      doQuery(sql_addNewNotification, sql_data)
        .then(() => {
          response.Helper.ok(req,res,true);
        })
        .catch((err) => {
          response.Helper.mysqlError(req,res,err);
        })
    }
  }
);

/**
 * 알림 [ 읽음 상태 or 중요 상태 or 알림 올 시간 or 지워짐 (프론트) 여부 ] 수정 라우터
 * @since 12/13
 * 읽음 상태 수정 필요, 중요 상태 수정 필요,
 * 알림 올 시간을 어떻게 설정? 생각 필요
 */
router.patch(
  "/",
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    if(req.user) {
      const user = req.user as User;
      const patchData = req.body as NotificationPatch;

      const sql = {
        query : '',
        data : new Array<any>()
      }

      if(patchData.option === 'READ') {
       sql.query = `
       UPDATE notifications
       SET isRead = 1
       WHERE userId = ? and _index = ?
       `;

       sql.data = [user.id, patchData._index];

       doQuery(sql.query, sql.data)
        .then(() => {
          response.Helper.ok(req,res, true);
        })
        .catch((err) => {
          response.Helper.mysqlError(req,res,err);
        })
      }
    }

  }
);

router.delete(
  "/",
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {}
);

export = router;
