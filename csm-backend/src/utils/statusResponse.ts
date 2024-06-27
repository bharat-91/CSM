export const statusCode = {
    SUCCESS: {
        code: 200,
        message: "Success"
    },
    ACCEPTED: {
        code: 202,
        message: "Input are accepted"
    },
    CREATED: {
        code: 201,
        message: "Created Successfully"
    },
    BAD_REQUEST: {
        code: 400,
        message: "Bad Request"
    },
    UNAUTHORIZED: {
        code: 401,
        message: "Not Authorized to View this Content "
    },
    FORBIDDEN: {
        code: 403,
        message: "Access Forbidden"
    },
    NOT_FOUND: {
        code: 404,
        message: "Not Found "
    },
    TOO_MANY_REQ: {
        code: 429,
        message: "Too many Requests"
    },
    SERVICE_UNAVAILABLE: {
        code: 503,
        message: "this service is currently noy available"
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        message: "Internal Server Error"
    },
    CONFLICT: {
        code: 409,
        message: "Please ensure to enter correct data"
    },
    NOT_MODIFIED: {
        code: 309,
        message: "Data not Modified"
    }
}

export const responseStatus = {
    SUCCESS: true,
    FAILED: false
}