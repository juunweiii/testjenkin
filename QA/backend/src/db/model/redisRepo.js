"use strict"

const { Repository, EntityId } = require("redis-om");
const path = require("path");
const fp = require("fastify-plugin");
const redisSchema = require(path.join(__dirname, "../schema/redisSchema"));

// Attach different redis repo into server
module.exports = fp(async function (fastify, opts) {
    // Decorate fastify instance with repos
    fastify.decorate("redisRepo", "");
    
    fastify.addHook("onRequest", async (req, reply) => {
        const redisRegisterRepo = new Repository(redisSchema.registerSchema, req.reqUtils.redisClients.redisRegister);
        const redisLoginRepo = new Repository(redisSchema.loginSchema, req.reqUtils.redisClients.redisLogin);
        const redisJwtRepo = new Repository(redisSchema.jwtSchema, req.reqUtils.redisClients.redisJwt);
        const redisPasswordResetRepo = new Repository(redisSchema.passwordResetSchema, req.reqUtils.redisClients.redisPasswordReset);
        const redisCacheTopicsRepo = new Repository(redisSchema.cacheTopicsSchema, req.reqUtils.redisClients.redisCache);
        const redisCacheSubtopicsRepo = new Repository(redisSchema.cacheSubtopicsSchema, req.reqUtils.redisClients.redisCache);
        const redisCacheThreadsRepo = new Repository(redisSchema.cacheThreadsSchema, req.reqUtils.redisClients.redisCache);
        const redisCacheUsersRepo = new Repository(redisSchema.cacheUsersSchema, req.reqUtils.redisClients.redisUser)
        
        const redisRepo = {
            entityId: EntityId,
            redisRegisterRepo: redisRegisterRepo,
            redisLoginRepo: redisLoginRepo,
            redisPasswordResetRepo: redisPasswordResetRepo,
            redisJwtRepo: redisJwtRepo,
            redisCacheTopicsRepo: redisCacheTopicsRepo,
            redisCacheSubtopicsRepo: redisCacheSubtopicsRepo,
            redisCacheThreadsRepo: redisCacheThreadsRepo,
            redisCacheUsersRepo: redisCacheUsersRepo,
        };

        req.reqUtils.redisRepo = redisRepo;
        fastify.redisRepo = redisRepo;


        // Create index for RedisSearch
        await redisRegisterRepo.createIndex();
        await redisLoginRepo.createIndex();
        await redisPasswordResetRepo.createIndex();
        await redisJwtRepo.createIndex();
        await redisCacheTopicsRepo.createIndex();
        await redisCacheSubtopicsRepo.createIndex();
        await redisCacheThreadsRepo.createIndex();
        await redisCacheUsersRepo.createIndex();
    });
}, {
    name: "redisRepo",
});