"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const SubTopics = model.subTopicsModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId
        const subTopicsId = new mongoose.Types.ObjectId(body.subTopicsId);
        if (!mongoose.Types.ObjectId.isValid(subTopicsId)) return errorRes(reply, 400, null, null);

        // Check if data exists
        let subTopicsData = await SubTopics.findOne(SubTopics.translateAliases({ subTopicsId: subTopicsId  }));
        if (_.isNil(subTopicsData)) return errorRes(reply, 400, "Subtopic does not exists.", null);

        // Check if jwt is moderator or is original user
        let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        if (userData.role !== "moderator") {
            if (String(subTopicsData.createdBy) !== jwtPayload.userId) {    
                return errorRes(reply, 403, null, null); 
            }
        }

        // Delete from database
        const condition = {
            subTopicsId: subTopicsId,
        }
        const options = {
            translateAliases: true,
            includeResultMetadata: true,
        }
        subTopicsData = await SubTopics.findOneAndDelete(condition, options);
        if (_.isNil(subTopicsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully deleted subtopic.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}