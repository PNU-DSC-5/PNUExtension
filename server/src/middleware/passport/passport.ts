import passport from 'passport';
import doQuery from '../../database/doQuery';
import { Strategy as GoogleStrategy , VerifyCallback } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { v4 as uuidV4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

passport.serializeUser( (user, done) => {
  done(null, user);
});

passport.deserializeUser( (user, done) => {
  done(null, user);
});

interface GoogleUser {
    sub : string;
    name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
    uuid? : string;
}

passport.use('auto-login',new CustomStrategy(
  (req, done) => {
    const uuid = req.body['uuid'];
    console.log('[Auto Login ... UUID ]',uuid);

    const sql_check_uuid = `
      SELECT * FROM users WHERE uuid = ?
    `;
    const sql_data = [uuid];

    doQuery(sql_check_uuid, sql_data)
      .then((row) => {
        if(row.result[0]){
          return done(null, row.result[0]);
        }

        return done(new Error('Not Exist UUID ... '), null);
      })
      .catch((err) => {
        return done(err, null);
      })
  }
))

passport.use('google',new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK!,
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const autoLogin: number = req.cookies.autoLogin;
    const googleUser: GoogleUser = profile._json;
    checkAndLogin(googleUser, autoLogin > 0 ? true:false , done);
  }));

function createUuid() {
  return uuidV4();
}

function checkAndLogin(user: GoogleUser, autoLogin: boolean, done: VerifyCallback) {
  const sql_dupleCheck = 'SELECT * FROM users WHERE id = ?';

  console.log('[Login Start ... ]');
  doQuery(sql_dupleCheck,[user.sub])
    .then((row)=>{
      console.log(row.result[0].uuid, row.result[0].email);
      
      if(!row.result[0]){
        /* 비회원 , 회원가입 이후 uuid 발급, 로그인 수행 */
        const sql_insert = `
          INSERT INTO users(id,thumbnail,email,locale,kind,uuid) VALUES(?,?,?,?,?,?)
        `;
        console.log('[Login : User Not Exist ... create user with uuid]');
        const sql_data = [user.sub,user.picture,user.email,user.locale,'google'];
        const uuid = createUuid();
        if(autoLogin) sql_data.push(uuid);
        
        doQuery(sql_insert,sql_data)
              .then(()=>{
                const user = {

                }
                return done(undefined,{...user, uuid});  
              })
              .catch((err)=>{
                console.log(err);
                return done(err,null);
              });        
      }
      else if(row.result[0] && autoLogin){
        if(row.result[0].uuid){
          /* 회원 + auto login + uuid o, 로그인 */
          console.log('[Login : User Exist , AutoLogin ... ]',row.result[0].uuid);
          done(undefined, {...row.result[0]});
        } else {
          /* 회원 + auto login + uuid x , uuid 발급 이후 로그인 */
          console.log('[Login : User Exist but has empty uuid ... create UUID]');
          const sql_update = `
            UPDATE users SET uuid = ? WHERE email = ?
          `;
          const uuid = createUuid();
          const sql_data = [uuid, user.email];

          doQuery(sql_update, sql_data)
            .then(() => {
              return done(undefined, {...user, uuid});
            })
            .catch((err) => {
              return done(err ,null);
            })
        }
      }
      else if(row.result[0] && !autoLogin){
        /* 회원 + auto login x + uuid x, 로그인 */
        console.log('[Login : User Exist ,TempLogin ... ]');
        done(undefined, user);
      }
      else {
        /* 회원 + auto login x + uuid x, 로그인 */
        done(new Error('Internal Server Error ... '), null);
      }
    })
};

// function createUUID() {
//   return new Promise((resolve, reject) => {
//     try{
//       const uuid = uuidV4();
//       resolve(uuid);
//     } catch(err){
//       reject(err);
//     }
//   });
// }

// function loginByThirdparty(user: GoogleUser, autoLogin: number, done: VerifyCallback) {
//     const sql_dupleCheck = 'SELECT * FROM users WHERE id = ?';

//     console.log('[Login Start ... ]', user.email);
//     doQuery(sql_dupleCheck,[user.sub])
//       .then((row)=>{
//         if(row.result.length === 0){
//           // 길이가 0, 중복 x , insert(회원가입) 시키고 done로그인 수행
//           const sql_insert = `
//             INSERT INTO users(id,thumbnail,email,locale,kind,uuid) VALUES(?,?,?,?,?,?)
//           `;
          
//           createUUID()
//             .then((uuid) => {
//               console.log('[Login : User Not Exist ... create user with uuid]');
//               doQuery(sql_insert,[user.sub,user.picture,user.email,user.locale,'google',uuid])
//                 .then(()=>{
//                   return done(undefined,{...user, uuid});  
//                 })
//                 .catch((err)=>{
//                   console.log(err);
//                   return done(err,null);
//                 })
//             })
//             .catch((err) => {
//               return done(err);
//             })
          
//         }
//         else if(row.result.length > 0 && !row.result[0].uuid){
//           console.log('[Login : User Exist but has empty uuid ... create uuid]');
//           const sql_update = `
//             UPDATE users SET uuid = ? WHERE email = ?
//           `;

//           createUUID()
//             .then((uuid) => {
//               doQuery(sql_update, [uuid, user.email])
//                 .then(() => {
//                   return done(undefined, row.result[0]);
//                 })
//                 .catch((err) => {
//                   return done(err ,null);
//                 })
              
//             })
//             .catch((err) => {
//               return done(err);
//             })
//         }
//         else{
//           done(undefined, user);
//         }
//       })
// };

export default passport;
