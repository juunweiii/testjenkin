"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../../../utils/response"));

const postSubTopicsSchema = {
    summary: "Create a new subtopic",
    description: "Moderator and users can create subtopics. Uses jwt, csrf_token and _csrf in cookie.<br>Uses title, description and topicsId in body. **Requires** title and topicsId and must be unique. Description can be null.",
    tags: ["subtopics"],
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
        required: ["title", "topicsId"],
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
                },
            }
        },
        400: errorResSchema[400],
        422: errorResSchema[422],
        500: errorResSchema[500],
    }
}

const updateSubTopicsSchema = {
    summary: "Update an existing subtopic",
    description: "Only moderator or original user can update subtopics. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** subTopicsId and must be unique. Description can be null.",
    tags: ["subtopics"],
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
                        subTopicsId: { type: "string", format: "objectId" },
                        title: { type: "string" },
                        description: { type: "string" },
                        topicsId: { type: "string", format: "objectId" },
                        like: {
                            type: "object",
                            properties: {
                                likesId: { type: "string" },
                                count: { type: "number" },
                                usersLike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId"}
                                },
                                usersDislike: {
                                    type: "array",
                                    items: { type: "string", format: "objectId"}
                                },
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
                                createdAt: { type: "string", format: "iso-date-time" },
                                updatedAt: { type: "string", format: "iso-date-time" },
                            }
                        },
                        topics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                topicsId: { type: "string", format: "objectId" },
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

const deleteSubTopicsSchema = {
    summary: "Delete an existing subtopic",
    description: "Only moderators can delete subtopics. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** subTopicsId.",
    tags: ["subtopics"],
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

const getAllSubTopicsSchema = {
    summary: "Get all subtopics from database **with pagination and filter options**",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie. <br>Can filter by search on title field or by topicsId, topicsId will take precedence if supplied. Pagination options available, not required if not needed.",
    tags: ["subtopics"],
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
            title: { type: "string" },
            limit: { type: "number", default: 0 },
            offset: { type: "number", default: 0 },
            sortField: { type: "string", enum: [
                "subTopicsId",
                "title",
                "description",
                "topicsId",
                "like.count",
                "createdBy",
                "updatedBy",
                "createdAt",
                "updatedAt",
            ], default: "subTopicsId" },
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
                                    subTopicsId: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
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
                                    topicsId: { type: "string" },
                                    // createdBy: { type: "string", format: "objectId" },
                                    // updatedBy: { type: "string", format: "objectId" },
                                    // createdAt: { type: "string", format: "iso-date-time" },
                                    updatedAt: { type: "string", format: "iso-date-time" },
                                    // topics: {
                                    //     type: "object",
                                    //     properties: {
                                    //         title: { type: "string" },
                                    //         description: { type: "string" },
                                    //         topicsId: { type: "string", format: "objectId" },
                                    //     }
                                    // },
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

const getSubTopicsSchema = {
    summary: "Get a subtopic from database",
    description: "Everyone can request. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** subTopicsId.",
    tags: ["subtopics"],
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
        required: ["subTopicsId"],
        properties: {
            subTopicsId: { type: "string", format: "objectId" },
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
                        subTopicsId: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        topicsId: { type: "string", format: "objectId" },
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
                                            username: { type: "string" },
                                            usersId: { type: "string", format: "objectId" },
                                            isBanned: { type: "string" },
                                            role: { type: "string" },
                                            profilePicture: { type: "string", format: "uri" },
                                        }
                                    }
                                },
                            }
                        },
                        topics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                // description: { type: "string" },
                                topicsId: { type: "string", format: "objectId" },
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

const likeOrDislikeSubTopicsSchema = {
    summary: "Like or dislike a subtopic",
    description: "Everybody can like or dislike subtopics. Uses jwt, csrf_token and _csrf in cookie.<br>**Requires** subTopicsId and must be unique. Like and dislike are booleans and are required. Both cannot be true.",
    tags: ["subtopics"],
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
        required: ["subTopicsId", "like", "dislike"],
        properties: {
            subTopicsId: { type: "string", format: "objectId" },
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
                        subTopicsId: { type: "string", format: "objectId" },
                        topicsId: { type: "string", format: "objectId" },
                        title: { type: "string" },
                        description: { type: "string" },
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
                                            usersId: { type: "string" },
                                        }
                                    }
                                },
                                dislikers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            usersId: { type: "string" },
                                        }
                                    }
                                },
                                likesId: { type: "string" },
                            }
                        },
                        createdBy: { type: "string", format: "objectId" },
                        updatedBy: { type: "string", format: "objectId" },
                        createdAt: { type: "string", format: "iso-date-time" },
                        updatedAt: { type: "string", format: "iso-date-time" },
                        topics: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
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
    getAllSubTopicsSchema, 
    getSubTopicsSchema, 
    postSubTopicsSchema, 
    deleteSubTopicsSchema, 
    updateSubTopicsSchema, 
    likeOrDislikeSubTopicsSchema 
}