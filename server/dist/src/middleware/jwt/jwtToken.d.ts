import express from 'express';
import { Payload, Token } from '../../shared/interfaces/token.interface';
declare function create(user: Payload): Promise<Token>;
declare function check(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
declare function refresh(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
declare const _default: {
    create: typeof create;
    check: typeof check;
    refresh: typeof refresh;
};
export default _default;
