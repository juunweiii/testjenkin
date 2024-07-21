"use strict"

const fp = require("fastify-plugin");

const checkBan = async function(req, reply) {
    // const getUsersCache = req.reqUtils.redisCache.getUsersCache;
    // const setUsersCache = req.reqUtils.redisCache.setUsersCache;
    const setJwtCache = req.reqUtils.redisCache.setJwtCache;
    const model = req.reqUtils.model;
    const mongoose = req.reqUtils.mongoose;
    const Users = model.usersModel;
    const _ = req.reqUtils._;
    const luxon = req.reqUtils.luxon;
    const errorRes = reply.replyUtils.errorRes;

    try {
        let reqData;

        // Handle jwt or body/query data
        if (!_.isNil(req.headers.jwtPayload)) {
            reqData = req.headers.jwtPayload;
            if (!_.isNil(reqData.userId)) reqData.usersId = new mongoose.Types.ObjectId(reqData.userId);
        } else {
            if (req.method === "POST" || req.method === "PUT") reqData = req.body;
            if (req.method === "GET") reqData = req.query;
            if ((_.isEmpty(reqData)) || (reqData.email === undefined)) {
                return errorRes(reply, 400, "Body/query should not be empty", null);
            }
        }

        // Find in cache
        // let userData = await getUsersCache({ email: reqData.email });
        // if (userData.status && userData.message === "Banned") {
        //     return errorRes(reply, 403, "User account is banned.", null); 
        // }
        // Check db
        const options = { translateAliases: true };
        let dbData = await Users.findOne({ $or: [
            { email: reqData.email },
            { usersId: reqData.usersId },
        ] }).setOptions(options);
        if (_.isEmpty(dbData)) return errorRes(reply, 400, null, null);

        // Blacklist JWT 
        // if (_.isNil(req.headers.jwtPayload)) return errorRes(reply, 400, null ,null);
        if (dbData.isBanned) {
            const cookieTokens = req.headers.cookie.split("; ");
            for (const cookie of cookieTokens) {
                if (cookie.includes("jwt=")) {
                    const jwtParts = cookie.split("=");
                    const jws = jwtParts[1];
                    let jwtData = await setJwtCache({
                        tokenId: String(jws),
                        expiryTime: req.headers.jwtPayload.exp,
                    });
                    if (!jwtData.status) return errorRes(reply, 500, null, null);
                }
            }
        }

        // Insert into cache and check for duplication
        // if (!userData.status && _.isNil(userData.message)) {
        //     userData =  await setUsersCache({
        //         userId: String(dbData.usersId),
        //         username: dbData.username,
        //         email: dbData.email,
        //         isBanned: dbData.isBanned
        //     });
        // }


        if (dbData.isBanned) {
            // Clear cookie header
            const now = luxon.DateTime.now();
            reply.clearCookie("jwt", { 
                path: "/",
                expires: now.toJSDate(),
                maxAge: now.toSeconds(),
            });
            reply.clearCookie("csrf_token", { 
                path: "/",
                expires: now.toJSDate(),
                maxAge: now.toSeconds(),
            });
            reply.clearCookie("_csrf", { 
                path: "/",
                expires: now.toJSDate(),
                maxAge: now.toSeconds(),
            });
            return errorRes(reply, 403, "User account is banned.", null);
        }
        return false;
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}

module.exports = fp(async function (fastify, opts) {
    fastify.decorate("checkBan", checkBan);    
    fastify.addHook("onRequest", async function(req, reply) {
        req.reqUtils.checkBan = checkBan;
    });
});