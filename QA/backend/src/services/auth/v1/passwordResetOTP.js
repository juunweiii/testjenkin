"use strict"

const argon2 = require("argon2");

// Logic for handling password reset 
module.exports = async function (req, reply) {
    // Extract required tools
    const getPasswordResetCache = req.reqUtils.redisCache.getPasswordResetCache;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body;

    try {
        // Format req data
        let reqData = {};
        if (!(_.isNil(body.email))) reqData.email = body.email;
        if (_.isNil(body.otp)) return errorRes(reply, 400, null, null);
        if (_.isNil(body.password)) return errorRes(reply, 400, null, null);
        reqData.otp = body.otp;
        reqData.password = body.password;
        
        // Check for cookie header
        if (!(_.isNil(req.headers.cookie))) {
            if (!_.isNil(req.headers.jwtPayload)) {
                let jwtPayload = req.headers.jwtPayload;
                reqData.usersId = jwtPayload.userId;
            }
        } else { reqData.usersId = null }

        // Check if data exists in cache
        let passwordData = await getPasswordResetCache(reqData);
        if (!(passwordData.status)) return errorRes(reply, 400, null, null); 

        // Check if account is banned
        const checkBan = await Users.findOne({ usersId: passwordData.data.usersId })
                                    .setOptions({ translateAliases: true });
        if (checkBan.isBanned) return errorRes(reply, 403, null, null);

        // Password hash
        const passwordHash = await argon2.hash(reqData.password, { secret: Buffer.from(process.env.ARGON2_SECRET) });
        
        // Update db
        let dbData;
        const query = {
            usersId: passwordData.data.usersId,
        }
        const insertion = {
            password: passwordHash,
        }
        const options = {
            translateAliases: true,
            new: true,
        }
        dbData = await Users.findOneAndUpdate(query, insertion, options);
        if (_.isEmpty(dbData)) return errorRes(reply, 400, null, null);
        
        return res(reply, 200, "Successfully reset password.")
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}