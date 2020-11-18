import passport from 'passport';
import doQuery from '../../database/doQuery';
import { Strategy as NaverStrategy } from 'passport-naver';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { v4 as uuidV4 } from 'uuid';

// shared interfaces
import { User, Url } from '../../shared/interfaces/user.interface';

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
        email_verified: false,
        url: [],
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
        email_verified: false,
        url: [],
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

      console.log(profile);
      const remoteData: User = {
        id: kakaoUser.id.toString(),
        email: '',
        locale: 'korea',
        picture: '',
        kind: 'kakao',
        name: kakaoUser.kakao_account.profile.nickname,
        email_verified: false,
        url: [],
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
      if (autoLogin) console.log('[Auto Login Checked ... ]');

      const remoteData: User = {
        id: githubUser.id.toString(),
        email: githubUser.email,
        locale: 'korea',
        picture: githubUser.avatar_url,
        kind: 'github',
        name: githubUser.name,
        email_verified: false,
        url: [],
      };

      checkAndLogin(remoteData, autoLogin > 0 ? true : false, done);
    },
  ),
);

/**
 * 고유 아이디 부여
 */
function createUuid() {
  return uuidV4();
}

/**
 * 회원가입
 * @param user 소셜 로그인에 의해 제공되는 유저 정보
 */
async function regist(
  user: User,
  autoLogin: boolean,
  done: (err?: Error, user?: User | null, info?: any) => void,
): Promise<any> {
  const sql_regist = `
  INSERT INTO users(name, id, picture, email, locale, kind, uuid) 
  VALUES(?,?,?,?,?,?,?)
  `;

  /* token 발급은 done 수행 이후 callback 함수에서 수행한다. 토큰 시간 지연 방지 */
  const sql_data: (string | null)[] = [
    user.name,
    user.id,
    user.picture,
    user.email,
    'kor',
    user.kind,
  ];

  /* uuid 생성 */
  if (autoLogin) sql_data.push(createUuid());
  else sql_data.push(null);

  doQuery(sql_regist, sql_data)
    .then(() => {
      console.log('[Sign Up] : Success , uuid , auto login : ' + autoLogin);
      const newUser: User = {
        ...user,
        email_verified: false,
        url: [],
      };

      /* 회원가입 성공 및 유저 정보 반환 */
      done(undefined, newUser);
    })
    .catch((err) => {
      /* 회원가입 실패 */
      done(err, null);
    });
}

/**
 * uuid 업데이트
 * @param userId uuid 를 업데이트 할 유저 아이디
 * @param create uuid 생성 or 초기화 여부
 */
async function updateUUID(
  userId: string,
  create?: true,
): Promise<string | undefined> {
  const sql_upadateUUID = `
  UPDATE users SET uuid = ? WHERE id = ?
  `;
  const sql_uuid = create ? createUuid() : undefined;

  return doQuery(sql_upadateUUID, [sql_uuid])
    .then(() => {
      return sql_uuid;
    })
    .catch(() => {
      return undefined;
    });
}

/**
 * 서드 파티 로그인 + 회원가입 로직
 * @param user      User 엔터티
 * @param autoLogin 자동 로그인 체크 여부
 * @param done      passport serialise initiator
 */
async function checkAndLogin(
  user: User,
  autoLogin: boolean,
  done: (err?: Error, user?: User | null | any, info?: any) => void,
) {
  const sql_GetProfile = `
  SELECT * FROM users
  WHERE users.id = ?
  `;

  doQuery(sql_GetProfile, [user.id]).then(async (row) => {
    const dbProfile: User = {
      ...row.result[0],
      email_verified: false,
    };

    if (!row.result[0]) {
      /* 회원 가입 */
      await regist(user, autoLogin, done);
    } else {
      /* 로그인 */
      if (autoLogin) {
        /* 자동 로그인 */
        if (dbProfile.uuid) {
          console.log('[Auto Login] : Success , uuid exist');
          done(undefined, dbProfile);
        } else {
          updateUUID(dbProfile.id, true).then((uuid) => {
            console.log('[Auto Login] : Success , uuid create');
            done(undefined, { ...dbProfile, uuid });
          });
        }
      } else {
        /* 일시 로그인 */
        updateUUID(dbProfile.id).then((uuid) => {
          console.log('[Temp Login] : Success');
          done(undefined, { ...dbProfile, uuid: undefined });
        });
      }
    }
  });
}

export default passport;
