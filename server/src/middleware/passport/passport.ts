import passport from 'passport';
import { Strategy as NaverStrategy } from 'passport-naver';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { v4 as uuidV4 } from 'uuid';
import * as dotenv from 'dotenv';
import doQuery from '../../database/doQuery';

// shared interfaces
import { User, Url } from '../../shared/interfaces/user.interface';

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
    const { uuid } = req.body;
    console.log('[Auto Login ... UUID ]', uuid);

    // const sql_check_uuid = `
    //   SELECT * FROM users u 
    //   LEFT JOIN urls ul
    //   ON ul.userId = u.id
    //   WHERE u.uuid = ?
    // `;
    // const sql_data = [uuid];

    const sql_check_uuid = `
    SELECT * FROM users
    WHERE uuid = ??
    `;

    doQuery(sql_check_uuid, [uuid])
      .then((row) => {
        if (row.result[0]) {
          const dbProfile: User = {
            ...row.result[0],
            email_verified: false
          };

          // const urls: Url[] = row.result
          //   .map((each: any) => ({
          //     url: each.url,
          //     name: each.urlName
          //   }))
          //   .filter(
          //     (eachUrl: Url) => eachUrl.url !== null && eachUrl.urlName !== null
          //   );

          return done(null, { ...dbProfile });
        }

        return done('Not Exist UUID ... ', null);
      })
      .catch((err) => done(err, null));
  })
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
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      const { autoLogin } = req.cookies;
      const googleUser: GoogleUser = profile._json;

      const remoteData: User = {
        id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        locale: googleUser.locale,
        picture: googleUser.picture,
        kind: 'google',
        email_verified: false,
        url: []
      };

      checkAndLogin(remoteData, autoLogin > 0, done);
    }
  )
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
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      const { autoLogin } = req.cookies;
      const naverUser: NaverUser = profile._json as NaverUser;

      const remoteData: User = {
        id: naverUser.id,
        email: naverUser.email,
        locale: 'korea',
        picture: naverUser.profile_image,
        kind: 'naver',
        name: naverUser.nickname,
        email_verified: false,
        url: []
      };

      checkAndLogin(remoteData, autoLogin > 0, done);
    }
  )
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
      callbackURL: process.env.KAKAO_CALLBACK!
    },
    (accessToken, refreshToken, profile, done) => {
      const kakaoUser = profile._json;
      const remoteData: User = {
        id: kakaoUser.id.toString(),
        email: '',
        locale: 'korea',
        picture: '',
        kind: 'kakao',
        name: kakaoUser.kakao_account.profile.nickname,
        email_verified: false,
        url: []
      };

      /**
       * 문제사항
       *
       * @param autologin 에 대한 설정이 필요함
       */
      checkAndLogin(remoteData, true, done);
    }
  )
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
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      const { autoLogin } = req.cookies;
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
        url: []
      };

      checkAndLogin(remoteData, autoLogin > 0, done);
    }
  )
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
  done: (err?: Error, user?: User | null, info?: any) => void
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
    user.kind
  ];

  /* uuid 생성 */
  // if (autoLogin) sql_data.push(createUuid());
  // else sql_data.push(null);

  sql_data.push(createUuid());

  doQuery(sql_regist, sql_data)
    .then(() => {
      console.log(`[Sign Up] : Success , uuid , auto login : ${autoLogin}`);
      const newUser: User = {
        ...user,
        email_verified: false,
        url: []
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
// async function updateUUID(
//   userId: string,
//   uuid: string|undefined,
//   create?: true
// ): Promise<string | undefined> {
//   const sql_upadateUUID = `
//   UPDATE users SET uuid = ? WHERE id = ?
//   `;
//   const sql_uuid = !uuid ? createUuid() : uuid;

//   if(uuid){
//     return uuid;
//   } else {
//     return doQuery(sql_upadateUUID,[sql_uuid])
//     .then(() => sql_uuid)
//     .catch(() => undefined)
//   }

  
// }

async function updateUUID(userId: string, uuid: string|undefined, create?:true):Promise<any>{
  
  if(uuid){ // uuid 가 존재하는 경우
    return uuid;
  } else { // uuid 가 없는 경우
    const sql_uuid = createUuid();
    const sql_upadateUUID = `
    UPDATE users SET uuid = ? WHERE id = ?
    `;
  
    return doQuery(sql_upadateUUID,[sql_uuid, userId])
      .then(() => sql_uuid)
      .catch(() => undefined)
  }
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
  done: (err?: Error, user?: User | null | any, info?: any) => void
) {
  const sql_GetProfile = `
  SELECT * FROM users u 
  LEFT JOIN urls as ul
  ON u.id = ul.userId
  WHERE u.id = ?
  `;

  doQuery(sql_GetProfile, [user.id]).then(async (row) => {
    const dbProfile: User = {
      ...row.result[0],
      email_verified: false
    };

    /* urls null 전처리 -> 빈배열 */
    const urls: Url[] = row.result
      .map((each: any) => ({
        url: each.url,
        name: each.urlName
      }))
      .filter((eachUrl: Url) => eachUrl.url !== null && eachUrl.urlName !== null);

    if (!row.result[0]) {
      /* 회원 가입 */
      await regist(user, autoLogin, done);
    } else {
      /* 로그인 */
      if (autoLogin) {
        /* 자동 로그인 허용 */
        // if (dbProfile.uuid) {
        //   updateUUID(dbProfile.id, true).then((uuid) => {
        //     console.log('[Auto Login] : Success , uuid create');
        //     done(undefined, { ...dbProfile, uuid, url: urls });
        //   });
        //   // console.log('[Auto Login] : Success , uuid exist');
        //   // done(undefined, { ...dbProfile, url: urls ,uuid});
        // } else {
        //   updateUUID(dbProfile.id, true).then((uuid) => {
        //     console.log('[Auto Login] : Success , uuid create');
        //     done(undefined, { ...dbProfile, uuid, url: urls });
        //   });
        // }
      } else {
        /* 일시 로그인 */
        updateUUID(dbProfile.id, dbProfile.uuid, true).then((uuid) => {
          console.log('[Temp Login] : Success', uuid);
          done(undefined, { ...dbProfile, uuid, url: urls });
        });
      }
    }
  });
}

export default passport;
