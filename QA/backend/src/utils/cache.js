"use strict"

const fp = require("fastify-plugin");
const luxon = require("luxon");

module.exports = fp(async function(fastify, opts) {

    fastify.addHook("onRequest", async function (req, reply) {
        // Default return value
        let data = {
            status: false,
            message: null
        };

        // Get all redis repos
        const DEFAULT_EXPIRATION = 60 * 10; // in seconds (10 mins)
        const CACHE_EXPIRATION = 60 * 60; // in seconds (1 hour)
        const _ = req.reqUtils._;
        const entityId = fastify.redisRepo.entityId;
        const redisRegisterRepo = fastify.redisRepo.redisRegisterRepo;
        const redisLoginRepo = fastify.redisRepo.redisLoginRepo;
        const redisPasswordResetRepo = fastify.redisRepo.redisPasswordResetRepo;
        const redisJwtRepo = fastify.redisRepo.redisJwtRepo;
        const redisCacheTopicsRepo = fastify.redisRepo.redisCacheTopicsRepo;
        const redisCacheSubtopicsRepo = fastify.redisRepo.redisCacheSubtopicsRepo;
        const redisCacheThreadsRepo = fastify.redisRepo.redisCacheThreadsRepo;
        const redisCacheUsersRepo = fastify.redisRepo.redisCacheUsersRepo;

        // Different caching mechanisms
        const getRegisterCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                if (_.has(obj, "otp")) {
                    let registerData = await redisRegisterRepo.search()
                                            // .where("username").eq(obj.username)
                                            .where("email").eq(obj.email)
                                            .and("otp").eq(obj.otp)
                                            .return.all()
                    if (registerData.length > 0) {
                        retData.status = true;
                        retData.message = "Matched OTP";
                        retData.data = registerData[0];
                        // Remove temp entry
                        await redisRegisterRepo.remove(registerData[0][entityId]);
                        
                        return retData;
                    }
                    return retData;
                }
                let registerData = await redisRegisterRepo.search()
                                        // .where("username").eq(obj.username)
                                        .where("email").eq(obj.email)
                                        .return.all()
                if (registerData.length > 0) {
                    retData.status = true;
                    retData.message = "Found data"
                    return retData;
                }
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setRegisterCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                let registerData = await redisRegisterRepo.save({
                    username: obj.username,
                    password: obj.password,
                    profilePicture: obj.profilePicture,
                    email: obj.email,
                    role: obj.role,
                    otp: obj.otp
                });
                await redisRegisterRepo.expire(registerData[entityId], DEFAULT_EXPIRATION);
                retData.status = true;
                retData.message = "Added into cache";
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const getLoginCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                if (_.has(obj, "otp")) {
                    let loginData = await redisLoginRepo.search()
                                        // .where("username").eq(obj.username)
                                        .where("email").eq(obj.email)
                                        .and("otp").eq(obj.otp)
                                        .return.all()
                    if (loginData.length > 0) {
                        retData.status = true;
                        retData.message = "Matched OTP";
                        retData.data = loginData[0];
                        // Remove temp entry
                        await redisLoginRepo.remove(loginData[0][entityId]);

                        return retData;
                    }
                    return retData;
                }
                let loginData = await redisLoginRepo.search()
                                        // .where("username").eq(obj.username)
                                        .where("email").eq(obj.email)
                                        .return.all()
                if (loginData.length > 0) {
                    retData.status = true;
                    retData.message = "Retrieved data"
                    retData.data = loginData[0];
                    return retData;
                }
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setLoginCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                let loginData = await redisLoginRepo.save({
                    userId: String(obj.userId),
                    username: obj.username,
                    password: obj.password,
                    profilePicture: obj.profilePicture,
                    email: obj.email,
                    role: obj.role,
                    otp: obj.otp
                });
                await redisLoginRepo.expire(loginData[entityId], DEFAULT_EXPIRATION);
                retData.status = true;
                retData.message = "Added into cache";
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const getPasswordResetCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                if (_.has(obj, "otp")) {
                    let passwordData;
                    if (_.isNil(obj.usersId)) {
                        passwordData = await redisPasswordResetRepo.search()
                        .where("email").eq(obj.email)
                        .and("otp").eq(obj.otp)
                        .return.all()
                    } else {
                        passwordData = await redisPasswordResetRepo.search()
                        .where("usersId").eq(obj.usersId)
                        .or("email").eq(obj.email)
                        .and("otp").eq(obj.otp)
                        .return.all()
                    }
                    if (passwordData.length > 0) {
                        retData.status = true;
                        retData.message = "Matched OTP";
                        retData.data = passwordData[0];
                        // Remove temp entry
                        await redisPasswordResetRepo.remove(passwordData[0][entityId]);

                        return retData;
                    }
                    return retData;
                }
                let passwordData
                if (_.isNil(obj.usersId)) {
                    passwordData = await redisPasswordResetRepo.search()
                                        .where("email").eq(obj.email)
                                        .return.all()
                } else {
                    passwordData = await redisPasswordResetRepo.search()
                                        .where("usersId").eq(obj.usersId)
                                        .or("email").eq(obj.email)
                                        .return.all()
                }
                if (passwordData.length > 0) {
                    retData.status = true;
                    retData.message = "Retrieved data"
                    retData.data = passwordData[0];
                    return retData;
                }
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setPasswordResetCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                let passwordData = await redisPasswordResetRepo.save({
                    usersId: obj.usersId,
                    email: obj.email,
                    otp: obj.otp
                });
                await redisPasswordResetRepo.expire(passwordData[entityId], DEFAULT_EXPIRATION)
                retData.status = true;
                retData.message = "Added into cache";
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        // Blacklist
        const getJwtCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                let jwtData = await redisJwtRepo.search()
                                    .where("tokenId").eq(obj.tokenId)
                                    .return.all()
                if (jwtData.length > 0) {
                    retData.status = true;
                    retData.message = "JWT Token is blacklisted";
                    retData.data = jwtData[0];
                    return retData;
                }
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            } 
        }

        // Blacklist
        const setJwtCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                let jwtData = await redisJwtRepo.save({
                    tokenId: String(obj.tokenId),
                    expiryTime: obj.expiryTime
                });
                const now = luxon.DateTime.now().toSeconds();
                const timeLeft = luxon.DateTime.fromSeconds(obj.expiryTime).minus({seconds: now}).toSeconds();
                await redisJwtRepo.expire(jwtData[entityId], Math.ceil(timeLeft));
                retData.status = true;
                retData.message = "Blacklisted token";
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const getTopicsCache = async function() {
            let retData = _.cloneDeep(data);
            try {


                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setTopicsCache = async function() {
            let retData = _.cloneDeep(data);
            try {
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const getSubtopicsCache = async function() {
            let retData = _.cloneDeep(data);
            try {
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setSubtopicsCache = async function() {
            let retData = _.cloneDeep(data);
            try {
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const getThreadsCache = async function() {
            let retData = _.cloneDeep(data);
            try {
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setThreadsCache = async function() {
            let retData = _.cloneDeep(data);
            try {
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }
        
        const getUsersCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                const userCacheData = await redisCacheUsersRepo.search()
                                // .where("username").eq(obj.username)
                                .where("email").eq(obj.email)
                                .return.all()
                if (userCacheData.length > 0) {
                    retData.status = true;
                    if (userCacheData[0].isBanned) {
                        retData.message = "Banned";
                        return retData;
                    }
                    retData.message = "Username/email exists";
                    return retData;
                }
                return retData
            } catch (err) {
                console.log(err);
                fastify.log.error(err);
                return retData;
            }
        }

        const setUsersCache = async function(obj) {
            let retData = _.cloneDeep(data);
            try {
                const cacheData = await redisCacheUsersRepo.save({
                    userId: String(obj.userId),
                    username: obj.username,
                    email: obj.email,
                    isBanned: obj.isBanned,
                });
                await redisCacheUsersRepo.expire(cacheData[entityId], CACHE_EXPIRATION);
                retData.status = true;
                retData.message = "Added to cache."
                return retData;
            } catch (err) {
                console.log(err);
                fastify.log.error(err)
                return retData;
            }
        }

        req.reqUtils.redisCache = {
            getRegisterCache: getRegisterCache,
            setRegisterCache: setRegisterCache,
            getLoginCache: getLoginCache,
            setLoginCache: setLoginCache,
            getPasswordResetCache: getPasswordResetCache,
            setPasswordResetCache: setPasswordResetCache,
            getJwtCache: getJwtCache,
            setJwtCache: setJwtCache,
            getTopicsCache: getTopicsCache,
            setTopicsCache: setTopicsCache,
            getSubtopicsCache: getSubtopicsCache,
            setSubtopicsCache: setSubtopicsCache,
            getThreadsCache: getThreadsCache,
            setThreadsCache: setThreadsCache,
            getUsersCache: getUsersCache,
            setUsersCache: setUsersCache,
        }
    });
}, {
    name: "redisCache",
});