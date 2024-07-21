"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../../../utils/response"));

const logoutSchema = {
    summary: "Logout of an account",
    description: "Uses jwt, csrf_token and _csrf in cookie.",
    tags: ["auth"],
    security: [
        {
            jwt: [],
        },
        {
            csrf: [],
        },
        {
            csrfSecret: [],
        },
    ],
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully logout."] },
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}

const loginSchema = {
    summary: "Login of an account (pt 1)",
    description: "Compares with database of user credentials for authentication. Sends email OTP for verification.<br>Login function before 2FA.",
    tags: ["auth"],
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email", examples: [process.env.USER_EMAIL] },
            password: { type: "string", examples: [process.env.USER_PASSWORD_SWAGGER] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Temporarily verified, please enter OTP sent to your email (10mins). Check your spam folder for email."] },
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        401: errorResSchema[401],
        403: errorResSchema[403],
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const loginOTPSchema = {
    summary: "Login of an account (pt 2)",
    description: "\>Compare username and OTP into current cache. (10 mins)<br>Email 2FA.",
    tags: ["auth"],
    query: {
        type: "object",
        required: ["otp", "email"],
        properties: {
            email: { type: "string", format: "email", examples: [process.env.USER_EMAIL] },
            otp: { type: "number" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully authenticated."]},
                data: { 
                    type: "object",
                    // properties: {
                    //     token: { type: "string", examples: ["jwt token"] },
                    //     "Csrf-Token": { type: "string", examples: ["csrf token"] }
                    // },
                },
            }
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
    }
}

const registerSchema = {
    summary: "Registration of new user (pt 1)",
    description: "Temporarily store in redis with OTP set. Not inserted into DB.<br>Username and email must be unique. This endpoint forces role of \"user\". Make sure email exsists as OTP **WILL BE SENT**",
    tags: ["auth"],
    body: {
        required: ["username", "password", "email", "profilePicture"],
        type: "object",
        properties: {
            username: { type: "string", examples: ["bob"] },
            password: { type: "string", examples: ["bob"] },
            profilePicture: { type: "string", examples: ["/assets/bob.png"], format: "uri" },
            email: { type: "string", format: "email", examples: ["bob@gmail.com"] },
        },
        "x-examples": {
            "Register a user": {
                value: {
                    username: "bob",
                    password: "bob",
                    profilePicture: "/assets/bob.png",
                    email: "bob@gmail.com",
                }
            },
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Temporarily registered, please enter OTP sent to your email (10mins). Check your spam folder for email."]},
                data: { 
                    type: "object",
                },
            }
        },
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const registerOTPSchema = {
    summary: "Registration of new user (pt 2)",
    description: "Verify OTP with redis OTP. Insert to database if validated.<br>Email and otp will be matched against redis record.",
    tags: ["auth"],
    query: {
        required: ["email", "otp"],
        type: "object",
        properties: {
            email: { type: "string", format: "email", examples: ["bob@gmail.com"] },
            otp: { type: "number", examples: ["00000000"] },

        },
        "x-examples": {
            "Validating username with OTP": {
                value: {
                    email: process.env.USER_EMAIL,
                    otp: "00000000",
                }
            },
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully authenticated."]},
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const passwordResetSchema = {
    summary: "Password of an account (pt 1)",
    description: "Compares with database of user credentials for authentication. Sends email OTP for verification.<br>Requires **email**. Auth Bearer can also be used but not required. Reset function before 2FA.",
    tags: ["auth"],
    body: {
        type: "object",
        required: ["email" ],
        properties: {
            email: { type: "string", format: "email", examples: [process.env.USER_EMAIL] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Temporarily verified, please enter OTP sent to your email (10mins). Check your spam folder for email."] },
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        403: errorResSchema[403],
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const passwordResetOTPSchema = {
    summary: "Password of an account (pt 2)",
    description: "Compares with database of user credentials for authentication. Sends email OTP for verification.<br>Requires **email, password and otp**. Auth Bearer can also be used but not required. Reset function before 2FA.",
    tags: ["auth"],
    body: {
        type: "object",
        required: ["email", "password", "otp" ],
        properties: {
            email: { type: "string", format: "email", examples: [process.env.USER_EMAIL] },
            password: { type: "string" },
            otp: { type: "number" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Temporarily verified, please enter OTP sent to your email (10mins). Check your spam folder for email."] },
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        403: errorResSchema[403],
        500: errorResSchema[500],
    }
}

module.exports = { 
    loginSchema, 
    registerSchema, 
    loginOTPSchema, 
    registerOTPSchema,
    logoutSchema, 
    passwordResetSchema,
    passwordResetOTPSchema,
}