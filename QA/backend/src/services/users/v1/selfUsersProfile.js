"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;

    try {
        // Get users id from jwt header
        if (_.isNil(req.headers.jwtPayload)) return errorRes(reply, 400, null, null);
        const usersId = req.headers.jwtPayload.usersId;
        if (!(mongoose.Types.ObjectId.isValid(usersId))) return errorRes(reply, 400, null, null);

        // Check db if data exists
        const options = { translateAliases: true };
        let usersData = await Users.exists({ usersId: usersId })
                                    .setOptions(options);
        if (_.isNil(usersData)) return errorRes(reply, 400, null, null);

        // Query the entry
        usersData = await Users.findOne({ usersId: usersId })
                                .select("-password -createdBy -updatedAt -updatedBy")
                                .setOptions(options);
        if (_.isNil(usersData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully retrieved user.", usersData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}