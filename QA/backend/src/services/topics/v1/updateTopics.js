"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId
        const topicsId = new mongoose.Types.ObjectId(body.topicsId);
        if (!mongoose.Types.ObjectId.isValid(topicsId)) return errorRes(reply, 400, null, null);

        // Check if data exists
        let topicsData = await Topics.exists(Topics.translateAliases({ topicsId: topicsId  }));
        if (_.isNil(topicsData)) return errorRes(reply, 400, "Topic does not exists.", null);

        // Check if jwt is admin
        // if (process.env.NODE_ENV === "production") {
        //     let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        //     if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        //     if (userData.role !== "admin") return errorRes(reply, 403, null, null); 
        // }

        // Update database
        const query = {
            topicsId: topicsId,
        }
        const insertion = {
            title: body.title,
            description: body.description,
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId)
        }
        const options = {
            translateAliases: true,
            new: true,
            // includeResultMetadata: true,
        }
        topicsData = await Topics.findOneAndUpdate(query, insertion, options)
                                    .populate({ path: "creator", select: "username" })
                                    .populate({ path: "updater", select: "username" })
                                    .select("-__v");
        if (_.isNil(topicsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully update topics.", topicsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}