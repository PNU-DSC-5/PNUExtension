import express, { Request, Response, NextFunction } from 'express';
import passport from '../../middleware/passport/passport';
import JwtToken from '../../middleware/jwt/jwtToken';
import response from '../../middleware/responseHelper/helper';
import { HttpError } from 'http-errors';

// shared interfaces
import { Payload, Token } from '../../shared/interfaces/token.interface';
import { User, Url } from '../../shared/interfaces/user.interface';
import * as dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Login Success');
});

router.get('/check-profile', JwtToken.check, async (req, res) => {
  if (req.user) {
    const userInfo: Payload = req.user as Payload;
    response.Helper.ok(req, res, userInfo);
  } else {
    response.Helper.serverError(req, res, new HttpError('Something Wrong ...'));
  }
});

/* refresh 토큰 사용한 accessToken 및 refreshToken 재발급 */
router.get(
  '/refresh',
  JwtToken.refresh,
  (req: express.Request, res: express.Response) => {
    console.log('[Excute Refresh Router Logic ... ]');

    if (req.user) {
      console.log('[Finish Refresh Router Logic ... ]');
      const { accessToken, refreshToken } = req.user as Token;

      res.cookie('test', 12).send({
        accessToken,
        refreshToken
      });
    } else {
      response.Helper.serverError(req, res, new Error('[Something Wrong ...]'));
    }
  }
);

/* auto login 수행 부 */
router.post(
  '/auto-login',
  passport.authenticate('auto-login'),
  async (req, res) => {
    try {
      const user: User = req.user as User;
      console.log('[Auto Login Success ]');
      console.log(user);

      const { accessToken, refreshToken } = await JwtToken.create({
        ...user,
        roles: 'user'
      });
      res.cookie('accessToken', accessToken, {});
      res.cookie('refreshToken', refreshToken, {});
      res.cookie('error', null);

      if (user.uuid) res.cookie('uuid', user.uuid);
      else res.cookie('uuid', null);

      response.Helper.ok(req, res, user);
    } catch (err) {
      response.Helper.serverError(req, res, err);
    }
  }
);

/* Google OAuth2.0 로그인  */
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google'),
  async (req, res) => {
    try {
      const user: User = req.user as User;
      console.log('[Google Login Success]');
      console.log(user);

      const { accessToken, refreshToken } = await JwtToken.create({
        ...user,
        roles: 'user'
      });
      res.cookie('accessToken', accessToken, {});
      res.cookie('refreshToken', refreshToken, {});
      res.cookie('error', null);

      if (user.uuid) res.cookie('uuid', user.uuid);
      else res.cookie('uuid', null);

      if (user.uuid) res.setHeader('uuid', user.uuid);
      else res.setHeader('uuid', '');

      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    } catch (err) {
      res.cookie('error', 'Internal server Error ... create Token');
      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    }
  }
);

/* Kakao OAuth2.0 로그인  */
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/kakao/callback',
  passport.authenticate('kakao'),
  async (req, res) => {
    try {
      const user: User = req.user as User;
      console.log('[Kakao Login Success]');
      console.log(user);

      const { accessToken, refreshToken } = await JwtToken.create({
        ...user,
        roles: 'user'
      });
      res.cookie('accessToken', accessToken, {});
      res.cookie('refreshToken', refreshToken, {});
      res.cookie('error', null);

      if (user.uuid) res.cookie('uuid', user.uuid);
      else res.cookie('uuid', null);

      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    } catch (err) {
      res.cookie('error', 'Internal server Error ... create Token');
      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    }
  }
);

/* GitHub OAuth2.0 로그인  */
router.get(
  '/github',
  passport.authenticate('github', {
    session: false,
    scope: ['profile', 'email']
  })
);
router.get(
  '/github/callback',
  passport.authenticate('github'),
  async (req, res) => {
    try {
      const user: User = req.user as User;
      console.log('[GitHub Login Success]');
      console.log(user);

      const { accessToken, refreshToken } = await JwtToken.create({
        ...user,
        roles: 'user'
      });
      res.cookie('accessToken', accessToken, {});
      res.cookie('refreshToken', refreshToken, {});
      res.cookie('error', null);

      if (user.uuid) res.cookie('uuid', user.uuid);
      else res.cookie('uuid', null);

      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    } catch (err) {
      res.cookie('error', 'Internal server Error ... create Token');
      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    }
  }
);

/* Naver OAuth2.0 로그인  */
router.get('/naver', passport.authenticate('naver'));
router.get(
  '/naver/callback',
  passport.authenticate('naver'),
  async (req, res) => {
    try {
      const user: User = req.user as User;
      console.log('[Naver Login Success]');
      console.log(user);

      const { accessToken, refreshToken } = await JwtToken.create({
        ...user,
        roles: 'user'
      });
      res.cookie('accessToken', accessToken, {});
      res.cookie('refreshToken', refreshToken, {});
      res.cookie('error', null);

      if (user.uuid) res.cookie('uuid', user.uuid);
      else res.cookie('uuid', null);

      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    } catch (err) {
      res.cookie('error', 'Internal server Error ... create Token');
      res.redirect(process.env.HOST_CLIENT || 'localhost:3000');
    }
  }
);

export = router;
