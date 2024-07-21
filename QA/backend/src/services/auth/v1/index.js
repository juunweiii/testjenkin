"use strict"

const path = require("path");
const schema = require(path.join(__dirname, "schema"));
const login = require(path.join(__dirname, "login"));
const loginOTP = require(path.join(__dirname, "loginOTP"));
const logout = require(path.join(__dirname, "logout"));
const register = require(path.join(__dirname, "register"));
const registerOTP = require(path.join(__dirname, "registerOTP"));
const passwordReset = require(path.join(__dirname, "passwordReset"));
const passwordResetOTP = require(path.join(__dirname, "passwordResetOTP"));


// Routes array of individual API services
const routes = [
    {
        method: "POST",
        url: "/login",
        handler: login,
        schema: schema.loginSchema,
    },

    {
        method: "GET",
        url: "/loginOTP",
        handler: loginOTP,
        schema: schema.loginOTPSchema,
    },
    {
        method: "POST",
        url: "/logout",
        handler: logout,
        schema: schema.logoutSchema,
    },
    {
        method: "POST",
        url: "/register", 
        handler: register,
        schema: schema.registerSchema,
    },
    {
        method: "GET",
        url: "/registerOTP",
        handler: registerOTP,
        schema: schema.registerOTPSchema,
    },
    {
        method: "POST",
        url: "/passwordReset",
        handler: passwordReset,
        schema: schema.passwordResetSchema,
    },
    {
        method: "POST",
        url: "/passwordResetOTP",
        handler: passwordResetOTP,
        schema: schema.passwordResetOTPSchema,
    },
];

module.exports = async function (fastify, opts) {
    // Route each API for service
    // Append circuitbreaker, log req body data (if any) and authentication checks
    const _ = fastify.lodash;
    let preHandlerArr = [ 
        // fastify.auth([fastify.jwtVerify]), 
        fastify.circuitBreaker(),
    ];
    const noAuthRoutes = [
        "/login", 
        "/loginOTP", 
        "/register", 
        "/registerOTP",
        "/passwordReset",
        "/passwordResetOTP",
    ];
    const checkBanCsrfRoutes = [
        "/login", 
        "/loginOTP", 
        "/passwordReset",
        "/passwordResetOTP",
    ];
    routes.forEach((api, index) => {
        api.preHandler = _.cloneDeep(preHandlerArr);
        if (api.method !== "GET") {
            api.preHandler.push(fastify.logReqBody);
        }
        if (!noAuthRoutes.includes(api.url)) {
            api.preHandler.push(fastify.auth([fastify.jwtVerify]));
            api.preHandler.push(fastify.checkBan);
            api.preHandler.push(fastify.csrfProtection);
        }
        if (checkBanCsrfRoutes.includes(api.url)) {
            api.preHandler.push(fastify.checkBan);
        }
        if (api.url === "/logout") {
            api.preHandler.push(fastify.authorization);
        }
        api.config = fastify.rateLimitUtils.authRateLimit;
        fastify.route(api);
    });
} 