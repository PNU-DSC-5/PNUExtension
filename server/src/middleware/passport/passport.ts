import passport from 'passport';
import doQuery from '../../database/doQuery';
import { Strategy as GoogleStrategy , VerifyCallback } from 'passport-google-oauth20';
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

passport.use('google',new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK!,
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    const googleUser: GoogleUser = profile._json;
    loginByThirdparty(googleUser , done);
  }));

function createUUID() {
  return new Promise((resolve, reject) => {
    try{
      const uuid = uuidV4();
      resolve(uuid);
    } catch(err){
      reject(err);
    }
  });
}

function loginByThirdparty(user: GoogleUser, done: VerifyCallback) {
    const sql_dupleCheck = 'SELECT * FROM users WHERE id = ?';

    console.log('[Login Start ... ]', user.email);
    doQuery(sql_dupleCheck,[user.sub])
      .then((row)=>{
        if(row.result.length === 0){
          // 길이가 0, 중복 x , insert(회원가입) 시키고 done로그인 수행
          const sql_insert = `
            INSERT INTO users(id,thumbnail,email,locale,kind,uuid) VALUES(?,?,?,?,?,?)
          `;

          createUUID()
            .then((uuid) => {
              console.log('[Login : User Not Exist ... create user with uuid]');
              doQuery(sql_insert,[user.sub,user.picture,user.email,user.locale,'google',uuid])
                .then(()=>{
                  return done(undefined,{...user, uuid});  
                })
                .catch((err)=>{
                  console.log(err);
                  return done(err,null);
                })
            })
            .catch((err) => {
              return done(err);
            })
          
        }
        else if(row.result.length > 0 && !row.result[0].uuid){
          console.log('[Login : User Exist but has empty uuid ... create uuid]');
          const sql_update = `
            UPDATE users SET uuid = ? WHERE email = ?
          `;

          createUUID()
            .then((uuid) => {
              doQuery(sql_update, [uuid, user.email])
                .then(() => {
                  return done(undefined, row.result[0]);
                })
                .catch((err) => {
                  return done(err ,null);
                })
              
            })
            .catch((err) => {
              return done(err);
            })
        }
        else{
          done(undefined, user);
        }
      })
};

export default passport;
