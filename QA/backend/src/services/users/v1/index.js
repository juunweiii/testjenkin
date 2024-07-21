"use strict"

const path = require("path");
const schema = require(path.join(__dirname, "schema"));
const banUsers = require(path.join(__dirname, "banUsers"));
const getAllUsers = require(path.join(__dirname, "getAllUsers"));
const getUsers = require(path.join(__dirname, "getUsers"));
const getUsersRep = require(path.join(__dirname, "getUsersRep"));
const updateUsers = require(path.join(__dirname, "updateUsers"));
const updateUsersRole = require(path.join(__dirname, "updateUsersRole"));
const selfUsersProfile = require(path.join(__dirname, "selfUsersProfile"));

// Routes array of individual API services
const routes = [
    {
        method: "PATCH",
        url: "/banUsers",
        handler: banUsers,
        schema: schema.banUsersSchema,
    },
    {
        method: "GET",
        url: "/getAllUsers",
        handler: getAllUsers,
        schema: schema.getAllUsersSchema,
    },
    {
        method: "PATCH",
        url: "/updateUsers",
        handler: updateUsers,
        schema: schema.updateUsersSchema,
    },
    {
        method: "PATCH",
        url: "/updateUsersRole",
        handler: updateUsersRole,
        schema: schema.updateUsersRoleSchema,
    },
    {
        method: "GET",
        url: "/getUsers",
        handler: getUsers,
        schema: schema.getUsersSchema,
    },
    {
        method: "GET",
        url: "/getUsersRep",
        handler: getUsersRep,
        schema: schema.getUsersRepSchema,
    },
    {
        method: "GET",
        url: "/selfUsersProfile",
        handler: selfUsersProfile,
        schema: schema.selfUsersProfileSchema,
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