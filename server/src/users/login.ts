import express, { Request, Response, NextFunction} from 'express';
import passport from '../middleware/passport/passport';
import JwtToken, { Payload } from '../middleware/jwt/jwtToken';
import response from '../middleware/responseHelper/helper';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Login Success');
});

router.get('/isok', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Login Success');
});

interface Token {
  readonly accessToken : string;
  readonly refreshToken : string;
}

/* refresh 토큰 사용한 accessToken 및 refreshToken 재발급 */
router.post('/refresh', JwtToken.refresh, (req: express.Request, res: express.Response) => {
  console.log('refresh router');
  if(true){
    // console.log('[Success : Refresh Token ... ]');
    // const user: Payload = req.user as Payload;
    // const { accessToken, refreshToken } = await JwtToken.create(user);

    // res.cookie('accessToken', accessToken);
    // res.cookie('refreshToken', refreshToken);
    // res.cookie('error', null);
    // res.send(true);
    const { accessToken , refreshToken } = req.user as Token;
    // res.cookie('accessToken', accessToken);
    // res.cookie('refreshToken', refreshToken);
    // res.cookie('error', 'refreshed !');
    // res.cookie('test', true)

    res.setHeader('test','ok ... ');
    res.send({
      accessToken,
      refreshToken,
    });

  } else{
    response.Helper.serverError(req,res,new Error('[Something Wrong ...]'));
  }
})

/* Google OAuth2.0 로그인  */
interface GoogleUser {
    name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

router.get('/google',passport.authenticate('google', {session: false, scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), async (req,res) => {
   try{
    const user: GoogleUser = req.user as GoogleUser;
    console.log("[Google Login Success]", user.email);

    const { accessToken, refreshToken } = await JwtToken.create({...user, roles: 'user'});
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    res.cookie('error', null);
    res.redirect('http://localhost:3003');

   } catch(err) {
    console.log(err);
    res.cookie('error', "Internal server Error ... create Token");
    res.redirect('http://localhost:3003');
   } 
});

router.get('/test' , JwtToken.check, async (req,res) => {
  console.log(req.user);
  res.send('Good Test!')
});

export = router;