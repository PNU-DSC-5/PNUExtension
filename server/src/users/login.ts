import express, { Request, Response, NextFunction} from 'express';
import passport from '../middleware/passport/passport';
import JwtToken from '../middleware/jwt/jwtToken';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('PNU Extension Login Success');
});

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
  console.log(req.user);
  res.send('ok')
})

export = router;