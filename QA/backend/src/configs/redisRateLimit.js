"use strict"

const fp = require("fastify-plugin");
const Redis = require("ioredis");

module.exports = fp(async function(fastify, opts) {
    const redis = new Redis({
        connectionName: "Rate-Limiter",
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 500,
        maxRetriesPerRequest: 1,
        db: 1,
    });

    const authRateLimit = {
        rateLimit: {
            max: 5,
            ban: 1,
            timeWindow: "1m",
        }
    }

    const rateLimitUtils = {
        authRateLimit: authRateLimit,
    };

    fastify.decorate("redisRateLimit", redis);
    fastify.decorate("rateLimitUtils", rateLimitUtils);
});