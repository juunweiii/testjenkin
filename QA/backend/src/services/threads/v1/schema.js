"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../../../utils/response"));

const postThreadsSchema = {
    summary: "Create a new thread",
    description: "Everybody can create threads. Uses jwt, csrf_token and _csrf in cookie.<br>Uses content and subTopicsId in body. **Requires** subTopicsId and must be unique.",
    tags: ["threads"],
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
        required: ["subTopicsId"],
        properties: {
            subTopicsId: { type: "string", format: "objectId" },
            content: { type: "string", examples: ["Lorem Ipsum"] },
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
        500: errorResSchema[500],
    }
}

const updateThreadsSchema = {
    summary: "Update an existing thread",
    description: "Only moderator or original user can update threads. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** threadsId and must be unique. Description can be null.",
    tags: ["threads"],
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
        required: ["threadsId"],
        properties: {
            threadsId: { type: "string", format: "objectId" },
            subTopicsId: { type: "string", format: "objectId" },
            content: { type: "string", examples: ["Lorem Ipsum"] },
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
                        subTopicsId: { type: "string", format: "objectId" },
                        threadsId: { type: "string", format: "objectId" },
                        content: { type: "string" },
                        like: {
                            type: "object",
                            properties: {
                                count: { type: "number" },
                                usersLike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId"}
                                },
                                usersDislike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId"}
                                },
                                createdAt: { type: "string", format: "iso-date-time" },
                                updatedAt: { type: "string", format: "iso-date-time" },
                                likers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                                dislikers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                                likesId: { type: "string" },
                            }
                        },
                        subTopics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                like: { 
                                    type: "object",
                                    properties: {
                                        count: { type: "number" },
                                        usersLike: {
                                            type: "array",
                                            items: { type: "string", format: "objectId"}
                                        },
                                        usersDislike: {
                                            type: "array",
                                            items: { type: "string", format: "objectId"}
                                        },
                                        createdAt: { type: "string", format: "iso-date-time" },
                                        updatedAt: { type: "string", format: "iso-date-time" },
                                        likers: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                    usersId: { type: "string", format: "objectId" },
                                                }
                                            }
                                        },
                                        dislikers: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                    usersId: { type: "string", format: "objectId" },
                                                }
                                            }
                                        },
                                        likesId: { type: "string" },
                                    } 
                                },
                                topicsId: { type: "string", format: "objectId" },
                                subTopicsId: { type: "string", format: "objectId" },
                            }
                        },
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
                        },
                        createdBy: { type: "string", format: "objectId" },
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

const deleteThreadsSchema = {
    summary: "Delete an existing thread",
    description: "Only moderators can delete threads. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** threadsId.",
    tags: ["threads"],
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
        required: ["threadsId"],
        properties: {
            threadsId: { type: "string", format: "objectId" },
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

const getAllThreadsSchema = {
    summary: "Get all threads from database **with pagination and filter options**",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>Can filter by content for search bar or subTopicsId, if subTopicsId is supplied it will take precedence. Pagination options available. Not required if not needed.",
    tags: ["threads"],
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
            content: { type: "string" },
            limit: { type: "number", default: 0 },
            offset: { type: "number", default: 0 },
            sortField: { type: "string", enum: [
                "threadsId",
                "content",
                "subTopicsId",
                "like.count",
                "createdBy",
                "updatedBy",
                "createdAt",
                "updatedAt",
            ], default: "threadsId" },
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
                                    threadsId: { type: "string", format: "objectId" },
                                    subTopicsId: { type: "string", format: "objectId" },
                                    content: { type: "string" },
                                    like: {
                                        type: "object",
                                        properties: {
                                            count: { type: "number" },
                                            usersLike: {
                                                type: "array",
                                                items: { type: "string", format: "objectId" },
                                            },
                                            usersDislike: {
                                                type: "array",
                                                items: { type: "string", format: "objectId" },
                                            },
                                            createdAt:  { type: "string", format: "iso-date-time" },
                                            updatedAt:  { type: "string", format: "iso-date-time" },
                                            likers: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        username:  { type: "string" },
                                                        usersId: { type: "string", format: "objectId" },
                                                        isBanned: { type: "string" },
                                                        role: { type: "string" },
                                                        profilePicture: { type: "string", format: "uri" },
                                                    }
                                                }
                                            },
                                            dislikers: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        username:  { type: "string" },
                                                        usersId: { type: "string", format: "objectId" },
                                                        isBanned: { type: "string" },
                                                        role: { type: "string" },
                                                        profilePicture: { type: "string", format: "uri" },
                                                    }
                                                }
                                            },
                                            likesId: { type: "string", format: "objectId" },
                                        },
                                    },
                                    // createdBy: { type: "string", format: "objectId" },
                                    // updatedBy: { type: "string", format: "objectId" },
                                    // createdAt: { type: "string", format: "iso-date-time" },
                                    updatedAt: { type: "string", format: "iso-date-time" },
                                    subTopics: {
                                        type: "object",
                                        properties: {
                                            title: { type: "string" },
                                            description: { type: "string" },
                                            topicsId: { type: "string", format: "objectId" },
                                            subTopicsId: { type: "string", format: "objectId" },
                                        }
                                    },
                                    creator: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string" },
                                            isBanned: { type: "string" },
                                            role: { type: "string" },
                                            profilePicture: { type: "string", format: "uri" },
                                        }
                                    },
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
                    },
                },
            }
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    },
}

const getThreadsSchema = {
    summary: "Get a thread from database",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** threadsId.",
    tags: ["threads"],
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
            threadsId: { type: "string", format: "objectId" },
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
                        threadsId: { type: "string", format: "objectId" },
                        subTopicsId: { type: "string", format: "objectId" },
                        content: { type: "string" },
                        // createdBy: { type: "string", format: "objectId" },
                        // updatedBy: { type: "string", format: "objectId" },
                        // createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                        like: {
                            type: "object",
                            properties: {
                                likesId: { type: "string", format: "objectId" },
                                count: { type: "number" },
                                usersLike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId" },
                                },
                                usersDislike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId" },
                                },
                                createdAt: { type: "string", format: "iso-date-time" },
                                updatedAt: { type: "string", format: "iso-date-time" },
                                likers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                                dislikers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                            }
                        },
                        subTopics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                topicsId: { type: "string", format: "objectId" },
                                subTopicsId: { type: "string", format: "objectId" },
                            }
                        },
                        creator: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                usersId: { type: "string" },
                            }
                        },
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

const likeOrDislikeThreadsSchema = {
    summary: "Like or dislike a thread",
    description: "Everybody can like or dislike thread. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** threadsId and must be unique. Like and dislike are booleans and are required. Both cannot be true.",
    tags: ["threads"],
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
        required: ["threadsId", "like", "dislike"],
        properties: {
            threadsId: { type: "string", format: "objectId" },
            like: { type: "boolean", examples: [false] },
            dislike: { type: "boolean", examples: [false] },
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
                        threadsId: { type: "string", format: "objectId" },
                        content: { type: "string" },
                        subTopicsId: { type: "string", format: "objectId" },
                        like: {
                            type: "object",
                            properties: {
                                count: { type: "number" },
                                usersLike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId" }
                                },
                                usersDislike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId" }
                                },
                                createdAt: { type: "string", format: "iso-date-time" },
                                updatedAt: { type: "string", format: "iso-date-time" },
                                likers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                                dislikers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                        }
                                    }
                                },
                                likesId: { type: "string", format: "objectId" },
                            }
                        },
                        createdBy: { type: "string", format: "objectId" },
                        updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                        subTopics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                subTopicsId: { type: "string", format: "objectId" },
                                topicsId: { type: "string", format: "objectId" }
                            } 
                        },
                        creator: { 
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                usersId: { type: "string", format: "objectId" }
                            }
                        },
                        updater: { 
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                usersId: { type: "string", format: "objectId" }
                            }

                        }
                    },
                },
            }
        },
        400: errorResSchema[400],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}

module.exports = { 
    getAllThreadsSchema, 
    getThreadsSchema, 
    postThreadsSchema, 
    deleteThreadsSchema, 
    updateThreadsSchema, 
    likeOrDislikeThreadsSchema 
}