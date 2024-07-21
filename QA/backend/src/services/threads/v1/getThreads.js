"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Threads = model.threadsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;

    try {
        // Make sure _id is ObjectId
        const threadsId = new mongoose.Types.ObjectId(query.threadsId );
        if (!mongoose.Types.ObjectId.isValid(threadsId)) return errorRes(reply, 400, null, null);

        // Check db if data exists
        const options = { translateAliases: true };
        let threadsData = await Threads.exists({ threadsId: threadsId })
                                    .setOptions(options); 
        if (_.isNil(threadsData)) return errorRes(reply, 400, null, null);
        
        // Query the entry
        threadsData = await Threads.findOne({ threadsId: threadsId  })
                                        // .select("-createdBy -createdAt -updatedBy")
                                        .populate({ path: "creator", select: "username" })
                                        // .populate({ path: "updater", select: "username" })
                                        .populate({ path: "subTopics", 
                                            select: [
                                                "topicsId",
                                                "title",
                                                "description"
                                            ],
                                            // populate: {
                                            //     path: "topics",
                                            //     select: [
                                            //         "title",
                                            //         "description"
                                            //     ]
                                            // } 
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "likers",
                                                select: "username" 
                                            } 
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "dislikers",
                                                select: "username" 
                                            } 
                                        })
                                        .setOptions(options);
        if (_.isNil(threadsData)) return errorRes(reply, 502, null, null);
        
        return res(reply, 200, "Successfully retrieved all data.", threadsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}