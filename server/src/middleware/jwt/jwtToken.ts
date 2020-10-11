import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import express from 'express';
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
    const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '7s' });
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH!, { expiresIn: '30d' });

    return {  accessToken, refreshToken  };
}


/* 요청 헤더 accesstoken 검사 미들웨어 */
async function check(req: express.Request, res: express.Response, next: express.NextFunction) {
    const accessToken: string = req.headers.accesstoken as string;
    if(accessToken){
        
        try{
            const decoded: Payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as Payload;
            req.user = decoded; // req 인스턴스에 api 요청 유저 정보 삽입
            next();

        }catch(err){
            res.send({
                status: 401,
                message: 'Unauthentication Error ... '
            });
        }

    }else{
        res.send({
            status: 401,
            message: 'Unauthentication Error ... '
        });
    }
}

export default {
    create, 
    check
}