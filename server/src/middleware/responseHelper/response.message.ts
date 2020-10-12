export const Status = {
    OK: 200,          
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    TOKEN_EXPIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNSUPPORTED_ACTION: 405,
    DATABASE_ERROR: 410,
    VALIDATION_FAILED: 422,
    SERVER_ERROR: 500,
    
};

export const statusMessage = (status: number) => {
    switch (status) {
        case Status.BAD_REQUEST:
            return 'Bad Request';
        case Status.UNAUTHORIZED:
            return 'Unauthorized';
        case Status.FORBIDDEN:
            return 'Forbidden';
        case Status.NOT_FOUND:
            return 'Not Found';
        case Status.UNSUPPORTED_ACTION:
            return 'Unsupported Action';
        case Status.VALIDATION_FAILED:
            return 'Validation Failed';
        case Status.SERVER_ERROR:
            return 'Internal Server Error';
        case Status.DATABASE_ERROR:
            return 'Database Error';
        case Status.TOKEN_EXPIRED:
            return 'JWT Expired'
    }
}