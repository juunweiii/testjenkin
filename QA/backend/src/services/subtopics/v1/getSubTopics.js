"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const SubTopics = model.subTopicsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;

    try {
        // Make sure _id is ObjectId
        const subTopicsId = new mongoose.Types.ObjectId(query.subTopicsId);
        if (!mongoose.Types.ObjectId.isValid(subTopicsId)) return errorRes(reply, 400, null, null);

        // Check db if data exists
        const options = { translateAliases: true };
        let topicsData = await SubTopics.exists({ subTopicsId: subTopicsId})
                                    .setOptions(options); 
        if (_.isNil(topicsData)) return errorRes(reply, 400, null, null);
        
        // Query the entry
        topicsData = await SubTopics.findOne({ subTopicsId: subTopicsId })
                                        // .select("-createdAt -createdBy -updatedBy")
                                        .populate({ path: "creator", select: "username isBanned role profilePicture" })
                                        // .populate({ path: "updater", select: "username isBanned role profilePicture" })
                                        .populate({ path: "topics", 
                                            select: [
                                                "topicsId",
                                                "title",
                                                // "description"
                                            ]
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "likers",
                                                select: "username isBanned role profilePicture" 
                                            } 
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "dislikers",
                                                select: "username isBanned role profilePicture" 
                                            } 
                                        })
                                        .setOptions(options);
        if (_.isNil(topicsData)) return errorRes(reply, 502, null, null);
        
        return res(reply, 200, "Successfully retrieved subtopic.", topicsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}