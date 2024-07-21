"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../../../utils/response"));

const banUsersSchema = {
    summary: "Update an existing user ban status",
    description: "Only admin can ban moderator. Only moderator can ban user. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** usersId and must be unique and isBanned as boolean.",
    tags: ["users"],
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
    body: {
        type: "object",
        required: ["usersId", "isBanned"],
        properties: {
            usersId: { type: "string", format: "objectId" },
            isBanned: { type: "boolean", examples: ["false"] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully update user ban status."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        email: { type: "string" },
                        profilePicture: { type: "string", format: "uri" },
                        username: { type: "string" },
                        isBanned: { type: "string" },
                        role: { type: "string" },
                        createdBy: { type: "string" },
                        updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                    },
                },
            }
        },
        400: errorResSchema[400],
        401: errorResSchema[401],
        403: errorResSchema[403],
        422: errorResSchema[422],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}

const updateUsersRoleSchema = {
    summary: "Update an existing user role",
    description: "Only admin can update user role. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** usersId and must be unique. Role is enum of [user/moderator]",
    tags: ["users"],
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
    body: {
        type: "object",
        required: ["usersId"],
        properties: {
            usersId: { type: "string", format: "objectId" },
            role: { type: "string", enum: ["user", "moderator"], examples: ["user"] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully update user."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        email: { type: "string" },
                        profilePicture: { type: "string", format: "uri" },
                        username: { type: "string" },
                        isBanned: { type: "string" },
                        role: { type: "string" },
                        createdBy: { type: "string" },
                        updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                    },
                },
            }
        },
        400: errorResSchema[400],
        401: errorResSchema[401],
        403: errorResSchema[403],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}

const updateUsersSchema = {
    summary: "Update an existing user profile",
    description: "Only original user can update threads. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** usersId and must be unique. username, email and profilePicture can be null.",
    tags: ["users"],
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
    body: {
        type: "object",
        required: ["usersId"],
        properties: {
            usersId: { type: "string", format: "objectId" },
            username: { type: "string", examples: ["Lorem Ipsum"] },
            // email: { type: "string", format: "email", examples: ["LoremIpsum@gmail.com"] },
            profilePicture: { type: "string", examples: ["Lorem Ipsum"], format: "uri" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully update user."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        email: { type: "string" },
                        profilePicture: { type: "string", format: "uri" },
                        username: { type: "string" },
                        isBanned: { type: "string" },
                        role: { type: "string" },
                        createdBy: { type: "string" },
                        updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                    },
                },
            }
        },
        400: errorResSchema[400],
        401: errorResSchema[401],
        403: errorResSchema[403],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}


const getAllUsersSchema = {
    summary: "Get all useres from database **with pagination and filter options**",
    description: "Only admins and moderators can request. Uses jwt, csrf_token and _csrf in cookie.<br>Can filter by username for search bar. Pagination options available. Not required if not needed.",
    tags: ["users"],
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
    query: {
        type: "object",
        properties: {
            username: { type: "string" },
            limit: { type: "number", default: 0 },
            offset: { type: "number", default: 0 },
            sortField: { type: "string", enum: [
                "usersId",
                "username",
                "email",
                "isBanned",
                "role",
                "createdAt",
                "updatedAt",
            ], default: "usersId" },
            sortOrder: { type: "string", enum: [
                "asc",
                "desc",
                "ascending",
                "descending",
            ], default: "asc" },
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully retrieved all data."] },
                data: { 
                    type: "object",
                    properties: {
                        total: { type: "number", examples: [0] },
                        result: {
                            type: "array",
                            items: { 
                                type: "object",
                                properties: {
                                    usersId: { type: "string", format: "objectId" },
                                    username: { type: "string" },
                                    profilePicture: { type: "string", format: "uri" },
                                    isBanned: { type: "string" },
                                    role: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    // createdBy: { type: "string" },
                                    // updatedBy: { type: "string", format: "objectId" },
                                    createdAt: { type: "string", format: "iso-date-time" },
                                    // updatedAt: { type: "string", format: "iso-date-time" },
                                } 
                            }
                        }
                    }
                },
            }
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    },
}

const getUsersSchema = {
    summary: "Get a user from database",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** usersId.",
    tags: ["users"],
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
    query: {
        type: "object",
        required: ["usersId"],
        properties: {
            usersId: { type: "string", format: "objectId" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully retrieved all data."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        username: { type: "string" },
                        profilePicture: { type: "string", format: "uri" },
                        email: { type: "string", format: "email" },
                        isBanned: { type: "string" },
                        role: { type: "string" },
                        // createdBy: { type: "string" },
                        // updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        // updatedAt: { type: "string", format: "iso-date-time" },
                    },
                }
            },
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    },
}

const getUsersRepSchema = {
    summary: "Get a user reputation from database",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** usersId.",
    tags: ["users"],
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
    query: {
        type: "object",
        properties: {
            usersId: { type: "string", format: "objectId" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully retrieved all data."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        reputation: { type: "number" },
                    },
                }
            },
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
    },
}

const selfUsersProfileSchema = {
    summary: "Get user's own data from database",
    description: "Uses current jwt token to get own profile without query. Uses jwt, csrf_token and _csrf in cookie.",
    tags: ["users"],
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
                message: { type: "string", examples: ["Successfully retrieved all data."] },
                data: { 
                    type: "object",
                    properties: {
                        usersId: { type: "string", format: "objectId" },
                        username: { type: "string" },
                        profilePicture: { type: "string", format: "uri" },
                        email: { type: "string", format: "email" },
                        isBanned: { type: "string" },
                        role: { type: "string" },
                        // createdBy: { type: "string" },
                        // updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        // updatedAt: { type: "string", format: "iso-date-time" },
                    },
                }
            },
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    },
}

module.exports = { 
    getAllUsersSchema, 
    getUsersSchema, 
    updateUsersSchema, 
    updateUsersRoleSchema,
    banUsersSchema,
    getUsersRepSchema, 
    selfUsersProfileSchema,
}