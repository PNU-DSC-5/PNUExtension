import jwt, { decode } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import doQuery from '../../database/doQuery';
import express from 'express';
import response from '../responseHelper/helper';
import createError from 'http-errors';
dotenv.config();

export interface Token {
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
    // console.log('user in create',user);
    const payload: Payload = {
        name : user.name,
        picture: user.picture,
        email: user.email,
        roles: user.roles
    }
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5s' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH!, { expiresIn: '5m' });
    const sql = 'UPDATE users SET refresh = ? WHERE email = ?';

    return doQuery(sql,[refreshToken, user.email])
        .then(() => {
            return { accessToken, refreshToken };
        })
} 


/* 요청 헤더 accesstoken 검사 미들웨어 */
async function check(req: express.Request, res: express.Response, next: express.NextFunction) {
    const accessToken: string = req.header('accesstoken')!;
    if(accessToken){
        try{
            const decoded: Payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as Payload;
            req.user = {
                ... decoded
            }; // req 인스턴스에 api 요청 유저 정보 삽입
            
            next();

        }catch(err){
            console.log('[Check Error : jwtExpired ... in Check]');
            response.Helper.jwtExpired(req,res, createError(402));
        }

    }else{
        console.log('[Check Error : unauthorized ... ]');
        response.Helper.unauthorized(req,res);
    }
}

async function refresh(req: express.Request, res: express.Response, next: express.NextFunction) {
    const refreshToken: string = req.header('refreshtoken')!;
   
    /* refresh 토큰이 헤더에 존재하는 경우 재발급 로직 수행  */
    if(refreshToken){
        try{
            /* refresh 토큰 분해로 email 획득  */
            const decoded: Payload = jwt.decode(refreshToken) as Payload;
            const sql = 'SELECT * FROM users WHERE email = ?';

            /*
                추가할 보안 로직

                리프레쉬 토큰 및 엑세스 토큰 탈취가능 -> API 접근 및 요청 수행 가능.
                (http only 옵션 적용이 불가능 .. cors 문제 해결 못함)

                받아온 refresh token 을 header 에 포함된 encoding 수식을 통해 분해 및 유효성 검증
                -> 단순 탈취로는 API 요청 불가능, 해당 수식에 맞춰 보내야함

                해당 Encoding 수식 을 관리하는 방법
            */
            
            doQuery(sql,[decoded.email, refreshToken])
                .then(async (row) =>  {
                    if(row.result[0]){
                         /* refresh 토큰 유효성 검증 후 재발급 */
                        const result = row.result[0];
                        console.log('[Success : Refresh Token ... ]');
                        create({
                            name: result.id,
                            picture: result.picture,
                            email: result.email,
                            roles: 'user',
                        }).then((token) => {
                            const {accessToken , refreshToken} = token;
                            req.user = {
                                accessToken,
                                refreshToken
                            };
                            next();
                        });
                    }
                    else{
                        response.Helper.unauthorized(req,res);
                    }
                })
                .catch((err) => {
                    console.log('[Refresh Error : Mysql ... ]')    ;
                    response.Helper.mysqlError(req, res, err);
                })

        }catch(err){
            console.log('[Refresh Error : jwtExpired ... ]');
            response.Helper.jwtExpired(req,res, createError(402));
        }

    }else{
        console.log('[Refresh Error : unauthorized ... ]');
        response.Helper.unauthorized(req,res);
    }
}

export default {
    create, 
    check,
    refresh
}