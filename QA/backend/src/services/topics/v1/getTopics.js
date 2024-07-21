"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;

    try {
        // Make sure _id is ObjectId
        const topicsId = new mongoose.Types.ObjectId(query.topicsId);
        if (!mongoose.Types.ObjectId.isValid(topicsId)) return errorRes(reply, 400, null, null);

        // Check db if data exists
        const options = { translateAliases: true };
        let topicsData = await Topics.exists({ topicsId: topicsId})
                                    .setOptions(options); 
        if (_.isNil(topicsData)) return errorRes(reply, 400, null, null);
        
        // Query the entry
        topicsData = await Topics.findOne({ topicsId: topicsId })
                                        .select("-createdBy -createdAt -updatedBy -updatedAt")
                                        // .populate({ path: "creator", select: "username" })
                                        // .populate({ path: "updater", select: "username" })
                                        .setOptions(options);
        if (_.isNil(topicsData)) return errorRes(reply, 502, null, null);
        

        return res(reply, 200, "Successfully retrieved all data.", topicsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}