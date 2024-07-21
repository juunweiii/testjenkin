"use strict"

const path = require("path");
const schema = require(path.join(__dirname, "schema"));
const postTopics = require(path.join(__dirname, "postTopics"));
const getAllTopics = require(path.join(__dirname, "getAllTopics"));
const updateTopics = require(path.join(__dirname, "updateTopics"));
const deleteTopics = require(path.join(__dirname, "deleteTopics"));
const getTopics = require(path.join(__dirname, "getTopics"));

// Routes array of individual API services
const routes = [
    {
        method: "POST",
        url: "/postTopics",
        handler: postTopics,
        schema: schema.postTopicsSchema,
    },
    {
        method: "GET",
        url: "/getAllTopics",
        handler: getAllTopics,
        schema: schema.getAllTopicsSchema,
    },
    {
        method: "PATCH",
        url: "/updateTopics",
        handler: updateTopics,
        schema: schema.updateTopicsSchema,
    },
    {
        method: "DELETE",
        url: "/deleteTopics", 
        handler: deleteTopics,
        schema: schema.deleteTopicsSchema,
    },
    {
        method: "GET",
        url: "/getTopics",
        handler: getTopics,
        schema: schema.getTopicsSchema,
    },
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