import express, { Request, Response, NextFunction } from 'express';
import doQuery from '../../database/doQuery';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';

import { User } from '../../shared/interfaces/user.interface';

const router = express.Router();

/**
 * 로그인 여부 상관 없이 모든 게시판 정보 조회
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('[Free Board Data FindAll] : Start ... ');
  
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
  },
);

/**
 * 자신의 게시물 수정
 */
router.patch(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('[Free Board Data Update One] : Start ... ');

  },
);

/**
 * 게시물 삭제
 */
router.delete(
  '/',
  JwtToken.check,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('[Free Board Data Delete One] : Start ... ');

  },
);

export = router;
