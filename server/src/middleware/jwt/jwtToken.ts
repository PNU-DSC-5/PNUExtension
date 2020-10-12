import jwt, { decode } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import doQuery from '../../database/doQuery';
import express from 'express';
import response from '../responseHelper/helper';
import createError from 'http-errors';
dotenv.config();

interface Token {
    readonly accessToken : string;
    readonly refreshToken : string;
}

export interface Payload {
    name: string;
    picture: string;
    email: string;
    roles: 'user' | 'admin';
}

/* jwt accesstoken 및 refreshtoken 생성 */
async function create(user: Payload): Promise<Token> {
    console.log('user in create',user);
    const payload: Payload = {
        name : user.name,
        picture: user.picture,
        email: user.email,
        roles: user.roles
    }
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5s' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH!, { expiresIn: '72h' });
    const sql = 'UPDATE users SET refresh = ? WHERE email = ?';

    console.log(refreshToken.length);
    // console.log(refreshToken)
    return doQuery(sql,[refreshToken, user.email])
        .then(() => {
            return { accessToken, refreshToken };
        })
    
} 


/* 요청 헤더 accesstoken 검사 미들웨어 */
async function check(req: express.Request, res: express.Response, next: express.NextFunction) {
    const accessToken: string = req.headers.accesstoken as string;
    if(accessToken){
        console.log('access token in Check', accessToken);
        try{
            const decoded: Payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as Payload;
            req.user = decoded; // req 인스턴스에 api 요청 유저 정보 삽입
            next();

        }catch(err){
            // const decoded: Payload = jwt.decode(accessToken, process.)
            console.log('[Error : jwtExpired ... in Check]');
            console.log(err);
            response.Helper.jwtExpired(req,res, createError(402));
        }

    }else{
        console.log('[Error : unauthorized ... ]');
        response.Helper.unauthorized(req,res);
    }
}

async function refresh(req: express.Request, res: express.Response, next: express.NextFunction) {
    const refreshToken: string = req.headers.refreshtoken as string;
    console.log('refresh Token in refresh : ',refreshToken);

    if(refreshToken){
        try{
            const decoded: Payload = jwt.verify(refreshToken, process.env.JWT_REFRESH!) as Payload;
            console.log( 'refresh Token decoded', decoded)
            const sql = 'SELECT * FROM users WHERE email = ?';

            doQuery(sql,[decoded.email, refreshToken])
                .then(async (row) =>  {
                    console.log(row.result[0]);
                    if(row.result[0]){
                        const result = row.result[0];
                        console.log('[Success : Refresh Token ... ]');
                        create({
                            name: result.id,
                            picture: result.thumbnail,
                            email: result.email,
                            roles: 'user',
                        }).then((token) => {
                            const {accessToken , refreshToken} = token;
                            console.log(
                                '+++++++++++++++++++++++',
                                jwt.verify(accessToken,process.env.JWT_SECRET!,(err, data) => {
                                    if(err) return err;
                                    else return data;
                                })
                            )
                            req.user = {
                                accessToken,
                                refreshToken
                            }
    
                            
                            
                            next();
                        });
                    }
                    else{
                        response.Helper.unauthorized(req,res);
                    }
                })
                .catch((err) => {
                    console.log('[Error : Mysql ... ]', err)    ;
                    response.Helper.mysqlError(req, res, err);
                })

        }catch(err){
            console.log('[Error : jwtExpired ... ]', err);
            response.Helper.jwtExpired(req,res, createError(402));
        }

    }else{
        console.log('[Error : unauthorized ... ]');
        response.Helper.unauthorized(req,res);
    }
}
export default {
    create, 
    check,
    refresh
}