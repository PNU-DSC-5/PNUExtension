/// <reference types="qs" />
import express from 'express';
declare const _default: {
    Helper: {
        ok: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, data: any) => void;
        badRequest: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, errors: any[]) => void;
        unauthorized: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>) => void;
        forbidden: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>) => void;
        notFound: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>) => void;
        unsupportedAction: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>) => void;
        invalid: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, errors: any[]) => void;
        serverError: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, error: any) => void;
        mysqlError: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, error: any) => void;
        jwtExpired: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: express.Response<any>, error: any) => void;
    };
};
export default _default;
