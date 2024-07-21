"use strict"
const projectName = process.env.DBPROJECT_NAME || "ThreadHub";

const path = require("path");
const authCheck = require(path.join(__dirname, "authCheck"));
const api = require(path.join(__dirname, "api"));
const schema = require(path.join(__dirname, "schema"));


const routes = [
    {
        method: "GET",
        url: "/authCheck",
        handler: authCheck,
        schema: schema.authCheckSchema,
    },
    {
        method: "GET",
        url: "/",
        handler: api,
    },
];

module.exports = async function(fastify, opts) {
    // Route each API for service
    const _ = fastify.lodash;
    let preHandlerArr = [
        fastify.circuitBreaker(),
    ];

    routes.forEach((api, index) => {
        api.preHandler = _.cloneDeep(preHandlerArr);
        if (api.url === "/authCheck") {
            api.preHandler.push(fastify.auth([fastify.jwtVerify]));
            api.preHandler.push(fastify.checkBan);
            api.preHandler.push(fastify.csrfProtection);
        }
        fastify.route(api);
    });
}