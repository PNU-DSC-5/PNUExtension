import passport from 'passport';
import doQuery from '../../database/doQuery';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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


function loginByThirdparty(user: GoogleUser, done: any) {
    const sql_dupleCheck = 'SELECT * FROM users WHERE id = ?';

    console.log('user in login', user);
    doQuery(sql_dupleCheck,[user.sub])
      .then((row)=>{
        if(row.result.length === 0){
          // 길이가 0, 중복 x , insert(회원가입) 시키고 done로그인 수행
          const sql_insert = `
            INSERT INTO users(id,thumbnail,email,locale,kind) VALUES(?,?,?,?,?)
          `;

          doQuery(sql_insert,[user.sub,user.picture,user.email,user.locale,'google'])
            .then((row)=>{
              return done(null,user);  
            })
            .catch((err)=>{
              console.log(err);
              return done(false);
            })
        }
        else{
          done(null,row.result[0]);
        }
      })
};

export default passport;
