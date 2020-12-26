export declare const Status: {
    OK: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    TOKEN_EXPIRED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    UNSUPPORTED_ACTION: number;
    DATABASE_ERROR: number;
    VALIDATION_FAILED: number;
    SERVER_ERROR: number;
};
export declare const statusMessage: (status: number) => "Unauthorized" | "Forbidden" | "Internal Server Error" | "Bad Request" | "Not Found" | "Unsupported Action" | "Validation Failed" | "Database Error" | "JWT Expired" | undefined;
