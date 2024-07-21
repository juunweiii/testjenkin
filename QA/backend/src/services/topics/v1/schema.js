"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../../../utils/response"));

const postTopicsSchema = {
    summary: "Create a new topic",
    description: "Only admins can create topics. Uses jwt, csrf_token and _csrf in cookie.<br>Uses title and description in body. **Requires** title and must be unique. Description can be null.",
    tags: ["topics"],
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
        required: ["title",],
        properties: {
            title: { type: "string", examples: ["A title"] },
            description: { type: "string", examples: ["Lorem Ipsum"] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully created a new topics."] },
                data: { 
                    type: "object",
                },
            }
        },
        401: errorResSchema[401],
        403: errorResSchema[403],
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const updateTopicsSchema = {
    summary: "Update an existing topic",
    description: "Only admins can update topics. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** title and must be unique. Description can be null.",
    tags: ["topics"],
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
        required: ["topicsId"],
        properties: {
            topicsId: { type: "string", format: "objectId" },
            title: { type: "string", examples: ["A title"] },
            description: { type: "string", examples: ["Lorem Ipsum"] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully created a new topics."] },
                data: { 
                    type: "object",
                    properties: {
                        topicsId: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        createdBy: { type: "string" },
                        updatedBy: { type: "string" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                        creator: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                usersId: { type: "string", format: "objectId" },
                            }
                        },
                        updater: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                usersId: { type: "string", format: "objectId" },
                            }
                        }
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

const deleteTopicsSchema = {
    summary: "Delete an existing topic",
    description: "Only admins can delete topics. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** topicsId. Description can be null.",
    tags: ["topics"],
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
        required: ["topicsId"],
        properties: {
            topicsId: { type: "string", format: "objectId" },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Successfully created a new topics."] },
                data: { 
                    type: "object",
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

const getAllTopicsSchema = {
    summary: "Get all topics from database **with pagination options**",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>Can filter by title as search bar option. Pagination options available. Not required if not needed.",
    tags: ["topics"],
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
            title: { type: "string" },
            limit: { type: "number", default: 0 },
            offset: { type: "number", default: 0 },
            sortField: { type: "string", enum: [
                "topicsId",
                "title",
                "description",
                "createdBy",
                "updatedBy",
                "createdAt",
                "updatedAt",
            ], default: "topicsId" },
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
                                    topicsId: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    // createdBy: { type: "string" },
                                    // updatedBy: { type: "string" },
                                    // createdAt: { type: "string", format: "iso-date-time" },
                                    // updatedAt: { type: "string", format: "iso-date-time" },
                                    // creator: {
                                    //     type: "object",
                                    //     properties: {
                                    //         username: { type: "string" },
                                    //         usersId: { type: "string" },
                                    //         isBanned: { type: "string" },
                                    //         role: { type: "string" },
                                    //         profilePicture: { type: "string", format: "uri" },
                                    //     }
                                    // },
                                    // updater: {
                                    //     type: "object",
                                    //     properties: {
                                    //         username: { type: "string" },
                                    //         usersId: { type: "string" },
                                    //         isBanned: { type: "string" },
                                    //         role: { type: "string" },
                                    //         profilePicture: { type: "string", format: "uri" },
                                    //     }
                                    // },
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

const getTopicsSchema = {
    summary: "Get a topic from database",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** topicsId.",
    tags: ["topics"],
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
            topicsId: { type: "string", format: "objectId" },
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
                        topicsId: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        // createdBy: { type: "string" },
                        // updatedBy: { type: "string" },
                        // createdAt: { type: "string", format: "iso-date-time" },
                        // updatedAt: { type: "string", format: "iso-date-time" },
                        // creator: {
                        //     type: "object",
                        //     properties: {
                        //         username: { type: "string" },
                        //         usersId: { type: "string" },
                        //     }
                        // },
                        // updater: {
                        //     type: "object",
                        //     properties: {
                        //         username: { type: "string" },
                        //         usersId: { type: "string" },
                        //     }
                        // }
                    },
                }
            },
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    },
}


module.exports = { postTopicsSchema, getAllTopicsSchema, updateTopicsSchema, deleteTopicsSchema, getTopicsSchema }