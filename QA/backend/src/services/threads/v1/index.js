"use strict"

const path = require("path");
const schema = require(path.join(__dirname, "schema"));
const postThreads = require(path.join(__dirname, "postThreads"));
const getAllThreads = require(path.join(__dirname, "getAllThreads"));
const getThreads = require(path.join(__dirname, "getThreads"));
const updateThreads = require(path.join(__dirname, "updateThreads"));
const deleteThreads = require(path.join(__dirname, "deleteThreads"));
const likeOrDislikeThreads = require(path.join(__dirname, "likeOrDislikeThreads"));

// Routes array of individual API services
const routes = [
    {
        method: "POST",
        url: "/postThreads",
        handler: postThreads,
        schema: schema.postThreadsSchema,
    },
    {
        method: "GET",
        url: "/getAllThreads",
        handler: getAllThreads,
        schema: schema.getAllThreadsSchema,
    },
    {
        method: "PATCH",
        url: "/updateThreads",
        handler: updateThreads,
        schema: schema.updateThreadsSchema,
    },
    {
        method: "DELETE",
        url: "/deleteThreads", 
        handler: deleteThreads,
        schema: schema.deleteThreadsSchema,
    },
    {
        method: "GET",
        url: "/getThreads",
        handler: getThreads,
        schema: schema.getThreadsSchema,
    },
    {
        method: "PATCH",
        url: "/likeOrDislikeThreads",
        handler: likeOrDislikeThreads,
        schema: schema.likeOrDislikeThreadsSchema,
    }
];

module.exports = async function (fastify, opts) {
    // Route each API for service
    // Append circuitbreaker, log req body data (if any) and authentication checks
    const _ = fastify.lodash;
    let preHandlerArr = [ 
        fastify.circuitBreaker(),
        fastify.auth([fastify.jwtVerify]), 
        fastify.checkBan,
        fastify.csrfProtection,
        fastify.authorization,
    ];
    routes.forEach((api, index) => {
        api.preHandler = _.cloneDeep(preHandlerArr);
        if (api.method !== "GET") {
            api.preHandler.push(fastify.logReqBody);
        }
        fastify.route(api);
    });
} 