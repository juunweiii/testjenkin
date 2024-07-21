"use strict"

require("@dotenvx/dotenvx").config();
const { createClient } = require("redis");
const log = require("pino")({ level: "error" });
const fp = require("fastify-plugin");

const createRedisInstance = async function(host, port, db, username = null, password = null) {
    const clientInstance = await createClient({
        socket: {
            port: port,
            host: host,
            family: 4,
            reconnectStrategy: (retries, err) => {
                if (err) {
                    console.log(err);
                    log.error(err);
                }
                Math.min(retries * 50, 1000);
            }
        },
        password: process.env.REDIS_PASSWORD,
        database: db,
    });
    try {
        if (await clientInstance) {
            await clientInstance.connect();
            return clientInstance;
        }
        throw new Error("Redis client Instance is empty");
    } catch (err) {
        console.log(err);
        log.error(err);
    }
}

// Attach different redis clients into server
module.exports = fp(async function (fastify, opts) { 
    const user = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_USER);
    const register = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_REGISTER);
    const login = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_LOGIN);
    const passwordReset = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_LOGIN);
    const jwt = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_JWT_BLACKLIST);
    const cache = await createRedisInstance(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB_CACHE);
    fastify.addHook("onRequest", async (req, reply) => {
        req.reqUtils.redisClients = {
            redisUser: user,
            redisRegister: register,
            redisLogin: login,
            redisPasswordReset: passwordReset,
            redisJwt: jwt,
            redisCache: cache,
        };
    });
}, {
    name: "redis"
});