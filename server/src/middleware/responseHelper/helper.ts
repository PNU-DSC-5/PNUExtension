'use strict';
import express from 'express';
import { statusMessage, Status } from './response.message';
import createError from 'http-errors';

/*
    REST API Http 프로토콜 및 Express 에서 잡아내는 기본 에러 응답을 구성한다.
    input   :   request? , response?, body?, options? ... 
    output  :   JSON response (메세지 , 상태값)
*/

function jsonResponse(res: express.Response, body: any, options: any) {
    options = options || {};
    options.status = options.status || Status.OK;
    res.status(options.status).json(body || null);
}

const Helper = {
    ok: function(req: express.Request, res: express.Response, data: any) {
        jsonResponse(res, data, {
            status: Status.OK
        });
    },

    badRequest: function(req: express.Request, res: express.Response, errors: any[]) {
        errors = Array.isArray(errors) ? errors : [errors];

        const body = {
            message: statusMessage(Status.BAD_REQUEST),
            errors: errors
        };

        jsonResponse(res, body, {
            status: Status.BAD_REQUEST
        });
    },

    unauthorized: function(req: express.Request, res: express.Response) {
        const body = {
            message: statusMessage(Status.UNAUTHORIZED)
        };

        jsonResponse(res, body, {
            status: Status.UNAUTHORIZED
        });
    },

    forbidden: function(req: express.Request, res: express.Response) {
        const body = {
            message: statusMessage(Status.FORBIDDEN)
        };

        jsonResponse(res, body, {
            status: Status.FORBIDDEN
        });
    },

    notFound: function(req: express.Request, res: express.Response) {
        const body = {
            message: statusMessage(Status.NOT_FOUND)
        };

        jsonResponse(res, body, {
            status: Status.NOT_FOUND
        });
    },

    unsupportedAction: function(req: express.Request, res: express.Response) {
        const body = {
            message: statusMessage(Status.UNSUPPORTED_ACTION)
        };

        jsonResponse(res, body, {
            status: Status.UNSUPPORTED_ACTION
        });
    },

    invalid: function(req: express.Request, res: express.Response, errors: any[]) {
        errors = Array.isArray(errors) ? errors : [errors];

        const body = {
            message: statusMessage(Status.VALIDATION_FAILED),
            errors: errors
        };

        jsonResponse(res, body, {
            status: Status.VALIDATION_FAILED
        });
    },

    serverError: function(req: express.Request, res: express.Response, error: any) {
        if (error instanceof Error) {
            error = {
                message: error.message,
                stacktrace: error.stack
            };
        }
        const body = {
            message: statusMessage(Status.SERVER_ERROR),
            error: error
        };

        jsonResponse(res, body, {
            status: Status.SERVER_ERROR
        });
    },

    mysqlError: function(req: express.Request, res: express.Response, error: any) {
        if(error instanceof Error){
            error = {
                message: error.message,
                stacktrace: error.stack
            };
        };

        const body = {
            message: statusMessage(Status.DATABASE_ERROR),
            error: error
        };

        jsonResponse(res, body, {
            status: Status.DATABASE_ERROR
        });
    },

    jwtExpired: function(req: express.Request, res: express.Response, error: any) {
        if(error instanceof Error){
            error = {
                message: error.message,
                stacktrace: error.stack
            };
        };

        const body = {
            name: 'TokenExpiredError',
            message: statusMessage(Status.TOKEN_EXPIRED),
            error: error
        };

        jsonResponse(res, body, {
            status: Status.TOKEN_EXPIRED
        });
    }
};

export default {
    Helper
}