"use strict"

const fp = require("fastify-plugin");

const authorization = async function(req, reply) {
    const _ = req.reqUtils._;
    const casbin = req.reqUtils.casbin;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const errorRes = reply.replyUtils.errorRes;

    try {
        // Query db
        const usersId = req.headers.jwtPayload.usersId;
        const options = { translateAliases: true };
        const usersData = await Users.findOne({ usersId: usersId })
                                        .setOptions(options);
        if (_.isNil(usersData)) return errorRes(reply, 400, "Invalid user", null);

        // Authorization check
        const sub = usersData.role;
        let obj = _.cloneDeep(req.raw.url);
        const act = req.raw.method;

        // Remove ? from urlparams
        if (obj.includes("?")) {
            const token = obj.split("?");
            obj = token[0];
        }
        const authReq = [sub, obj, act];

        // returns an array [bool, [policy]]
        const ok = await casbin.enforceEx(...authReq);
        
        if (!ok[0]) return errorRes(reply, 403, null, null);
        return true;
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}

module.exports = fp(async function(fastify, opts) {
    fastify.decorate("authorization", authorization);
});