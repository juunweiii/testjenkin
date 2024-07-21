"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Threads = model.threadsModel;
    const Users = model.usersModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId
        const threadsId = new mongoose.Types.ObjectId(body.threadsId);
        if (!mongoose.Types.ObjectId.isValid(threadsId)) return errorRes(reply, 400, null, null);

        // Check if data exists
        let threadsData = await Threads.findOne(Threads.translateAliases({ threadsId: threadsId  }));
        if (_.isNil(threadsData)) return errorRes(reply, 400, "Thread does not exists.", null);

        // Check if jwt is moderator or is original user
        let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        if (userData.role !== "moderator") {
            if (String(threadsData.createdBy) !== jwtPayload.userId) {
                return errorRes(reply, 403, null, null);
            }
        }

        // Delete from database
        const condition = {
            threadsId: threadsId,
        }
        const translatedCondition = await Threads.translateAliases(condition);
        const options = {
            translateAliases: true,
            // includeResultMetadata: true,
        }
        threadsData = await Threads.findOneAndDelete(condition, options);
        if (_.isNil(threadsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully deleted thread.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}