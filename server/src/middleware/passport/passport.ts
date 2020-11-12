import passport from 'passport';
import doQuery from '../../database/doQuery';
import { Strategy as NaverStrategy } from 'passport-naver';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { v4 as uuidV4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/* auto Login */
passport.use(
  'auto-login',
  new CustomStrategy((req, done) => {
    const uuid = req.body['uuid'];
    console.log('[Auto Login ... UUID ]', uuid);

    const sql_check_uuid = `
      SELECT * FROM users WHERE uuid = ?
    `;
    const sql_data = [uuid];

    doQuery(sql_check_uuid, sql_data)
      .then((row) => {
        if (row.result[0]) {
          return done(null, row.result[0]);
        }

        return done('Not Exist UUID ... ', null);
      })
      .catch((err) => {
        return done(err, null);
      });
  }),
);

interface User {
  id: string;
  name: string;
  refresh?: string;
  picture?: string;
  email: string;
  locale?: string;
  kind: 'local' | 'github' | 'google' | 'facebook' | 'kakao' | 'naver';
  uuid?: string;
}

/* Google Login */
interface GoogleUser {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  uuid?: string;
}

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const autoLogin: number = req.cookies.autoLogin;
      const googleUser: GoogleUser = profile._json;

      const remoteData: User = {
        id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        locale: googleUser.locale,
        picture: googleUser.picture,
        kind: 'google',
      };

      checkAndLogin(remoteData, autoLogin > 0 ? true : false, done);
    },
  ),
);

/* Naver Login */
interface NaverUser {
  email: string;
  nickname: string;
  profile_image: string;
  age: number;
  birthday: string;
  id: string;
}

passport.use(
  'naver',
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_SECRET!,
      callbackURL: process.env.NAVER_CALLBACK!,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const autoLogin: number = req.cookies.autoLogin;
      const naverUser: NaverUser = profile._json as NaverUser;

      const remoteData: User = {
        id: naverUser.id,
        email: naverUser.email,
        locale: 'korea',
        picture: naverUser.profile_image,
        kind: 'naver',
        name: naverUser.nickname,
      };

      checkAndLogin(remoteData, autoLogin > 0 ? true : false, done);
    },
  ),
);

/* Kakao Login */
interface KakaoUser {
  id: string;
  nickname: string;
  thumbnail_image_url: string;
}

passport.use(
  'kakao',
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID!,
      clientSecret: '',
      callbackURL: process.env.KAKAO_CALLBACK!,
    },
    (accessToken, refreshToken, profile, done) => {
      const kakaoUser = profile._json;

      const remoteData: User = {
        id: kakaoUser.id.toString(),
        email: '',
        locale: 'korea',
        picture: kakaoUser.profile.thumbnail_image_url,
        kind: 'kakao',
        name: kakaoUser.profile.nickname,
      };

      /**
       * 문제사항
       *
       * @param autologin 에 대한 설정이 필요함
       */
      checkAndLogin(remoteData, true, done);
    },
  ),
);

/* Github Login */
interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string;
  company: string;
  name: string;
}

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK!,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const autoLogin: number = req.cookies.autoLogin;
      const githubUser: GithubUser = profile._json as GithubUser;
      if(autoLogin) console.log('[Auto Login Checked ... ]');

      const remoteData: User = {
        id: githubUser.id.toString(),
        email: githubUser.email,
        locale: 'korea',
        picture: githubUser.avatar_url,
        kind: 'github',
        name: githubUser.name,
      };

      checkAndLogin(remoteData, autoLogin > 0 ? true : false, done);
    },
  ),
);

/* 클라이언트 요청에 고유 구별 키 부여 */
function createUuid() {
  return uuidV4();
}

/**
 * 서드 파티 로그인 + 회원가입 로직
 * @param user      User 엔터티
 * @param autoLogin 자동 로그인 체크 여부
 * @param done      passport serialise initiator
 */
function checkAndLogin(
  user: User,
  autoLogin: boolean,
  done: (err?: Error, user?: any, info?: any) => void,
) {
  const sql_dupleCheck = 'SELECT * FROM users WHERE id = ?';

  console.log('[Login Start ... ]');
  doQuery(sql_dupleCheck, [user.id]).then((row) => {
    if (!row.result[0]) {
      /* 비회원 , 회원가입 이후 uuid 발급, 로그인 수행 */
      const sql_insert = `
          INSERT INTO users(name,id,picture,email,locale,kind,uuid) VALUES(?,?,?,?,?,?,?)
        `;
      console.log('[Login : User Not Exist ... create user with uuid]');
      const sql_data: (string | undefined | null)[] = [
        user.name,
        user.id,
        user.picture,
        user.email,
        user.locale,
        user.kind,
      ];
      const uuid = createUuid();
      if (true) sql_data.push(uuid);
      else sql_data.push(null);

      doQuery(sql_insert, sql_data)
        .then(() => {
          return done(undefined, { ...user, uuid });
        })
        .catch((err) => {
          console.log(err);
          return done(err, null);
        });
    } else if (row.result[0] && autoLogin) {
      if (row.result[0].uuid) {
        /* 회원 + auto login + uuid o, 로그인 */
        console.log(
          '[Login : User Exist , AutoLogin ... ]',
          row.result[0].uuid,
        );
        done(undefined, { ...row.result[0] });
      } else {
        /* 회원 + auto login + uuid x , uuid 발급 이후 로그인 */
        console.log('[Login : User Exist but has empty uuid ... create UUID]');
        const sql_update = `
            UPDATE users SET uuid = ? WHERE id = ?
          `;
        const uuid = createUuid();
        const sql_data = [uuid, user.email];

        doQuery(sql_update, sql_data)
          .then(() => {
            return done(undefined, { ...user, uuid });
          })
          .catch((err) => {
            return done(err, null);
          });
      }
    } else if (row.result[0] && !autoLogin) {
      /* 회원 + auto login x + uuid x, 로그인 */
      console.log('[Login : User Exist ,TempLogin ... ]');
      done(undefined, user);
    } else {
      /* 회원 + auto login x + uuid x, 로그인 */
      done(new Error('Internal Server Error ... '), null);
    }
  });
}

export default passport;
