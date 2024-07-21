"use strict"

const path = require("path");
const schema = require(path.join(__dirname, "schema"));
const postSubTopics = require(path.join(__dirname, "postSubTopics"));
const getAllSubTopics = require(path.join(__dirname, "getAllSubTopics"));
const getSubTopics = require(path.join(__dirname, "getSubTopics"));
const updateSubTopics = require(path.join(__dirname, "updateSubTopics"));
const deleteSubTopics = require(path.join(__dirname, "deleteSubTopics"));
const likeOrDislikeSubTopics = require(path.join(__dirname, "likeOrDislikeSubTopics"));

// Routes array of individual API services
const routes = [
    {
        method: "POST",
        url: "/postSubTopics",
        handler: postSubTopics,
        schema: schema.postSubTopicsSchema,
    },
    {
        method: "GET",
        url: "/getAllSubTopics",
        handler: getAllSubTopics,
        schema: schema.getAllSubTopicsSchema,
    },
    {
        method: "PATCH",
        url: "/updateSubTopics",
        handler: updateSubTopics,
        schema: schema.updateSubTopicsSchema,
    },
    {
        method: "DELETE",
        url: "/deleteSubTopics", 
        handler: deleteSubTopics,
        schema: schema.deleteSubTopicsSchema,
    },
    {
        method: "GET",
        url: "/getSubTopics",
        handler: getSubTopics,
        schema: schema.getSubTopicsSchema,
    },
    {
        method: "PATCH",
        url: "/likeOrDislikeSubTopics",
        handler: likeOrDislikeSubTopics,
        schema: schema.likeOrDislikeSubTopicsSchema,
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