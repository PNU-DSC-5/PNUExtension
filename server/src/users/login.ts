import express, { Request, Response, NextFunction} from 'express';
import passport from '../middleware/passport/passport';
import JwtToken, { Payload, Token } from '../middleware/jwt/jwtToken';
import response from '../middleware/responseHelper/helper';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Login Success');
});

router.get('/check-profile', JwtToken.check, async (req, res) => {
  if(req.user){
    const userInfo: Payload = req.user as Payload;
    res.send(userInfo);
  }
  else{
    res.send(false);
  }
});

/* refresh 토큰 사용한 accessToken 및 refreshToken 재발급 */
router.get('/refresh', JwtToken.refresh, (req: express.Request, res: express.Response) => {
  console.log('[Excute Refresh Router Logic ... ]');
  if(req.user){
    console.log('[Finish Refresh Router Logic ... ]');
    const { accessToken , refreshToken } = req.user as Token;
    res.setHeader('refresh-result',[accessToken, refreshToken]);
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
    res.cookie('error', "Internal server Error ... create Token");
    res.redirect('http://localhost:3003');
   } 
});

router.get('/test' , JwtToken.check, async (req,res) => {
  res.send('Good Test!')
});

export = router;