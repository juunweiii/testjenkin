"use strict"

require("@dotenvx/dotenvx").config();
const { Schema } = require("redis-om");

const registerSchema = new Schema("register", {
    username: { type: "string" },
    password: { type: "string" },
    profilePicture: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    isBanned: { type: "boolean" },
    otp: { type: "number" },
}, {
    dataStructure: "JSON",
});

const loginSchema = new Schema("login", {
    userId: { type: "string" },
    username: { type: "string" },
    password: { type: "string"},
    profilePicture: {type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    isBanned: { type: "boolean" },
    otp: { type: "number" },
}, {
    dataStructure: "JSON"
});

const passwordResetSchema = new Schema("passwordReset", {
    usersId: { type: "string" },
    email: { type: "string" },
    otp: { type: "number" },
}, {
    dataStructure: "JSON"
});


const jwtSchema = new Schema("jwt", {
    tokenId: { type: "string" },            // original: uuid, jws only
    expiryTime: { type: "date" },           // UNIX epoch timestamp
}, {
    dataStructure: "JSON",
});

const cacheTopicsSchema = new Schema("cacheTopics", {
    topicsId: { type: "string" },           // original: object type
    title: { type: "string" },
    description: { type: "string" },
    createdBy: { type: "number" },
}, {
    dataStructure: "JSON",
});

const cacheSubtopicsSchema = new Schema("cacheSubtopics", {
    subtopicsId: { type: "string" },        // original: object type
    title: { type: "string" },
    description: { type: "string" },
    topicsId: { type: "number" },
    createdBy: { type: "number" },
}, {
    dataStructure: "JSON",
});

const cacheThreadsSchema = new Schema("cacheThreads", {
    threadsId: { type: "string" },          // original: object type
    content: { type: "string" },
    subtopicsId: { type: "string" },        // original: object type
    createdBy: { type: "number" },
    count: { type: "number" },
    users: { type: "number[]" },
}, {
    dataStructure: "JSON",
});

const cacheUsersSchema = new Schema("users", {
    userId: { type: "string" },             // original: object type
    username: { type: "string" },
    email: { type: "string" },
    isBanned: { type: "boolean" },
}, {
    dataStructure: "JSON",
});

module.exports = {
    registerSchema: registerSchema,
    loginSchema: loginSchema,
    passwordResetSchema: passwordResetSchema,
    jwtSchema: jwtSchema,
    cacheTopicsSchema: cacheTopicsSchema,
    cacheSubtopicsSchema: cacheSubtopicsSchema,
    cacheThreadsSchema: cacheThreadsSchema,
    cacheUsersSchema: cacheUsersSchema,
}
