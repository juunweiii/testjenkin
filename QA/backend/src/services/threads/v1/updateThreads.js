"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Threads = model.threadsModel;
    const Users = model.usersModel;
    const SubTopics = model.subTopicsModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId
        const threadsId = new mongoose.Types.ObjectId(body.threadsId);
        if (!mongoose.Types.ObjectId.isValid(threadsId)) return errorRes(reply, 400, null, null);

        let insertion = {
            content: body.content,
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId)
        };
        if (!(_.isNil(body.subTopicsId))) {
            const subTopicsId = new mongoose.Types.ObjectId(body.subTopicsId);
            if (!mongoose.Types.ObjectId.isValid(subTopicsId)) return errorRes(reply, 400, null, null);
            const subTopicsData = await SubTopics.exists({ subTopicsId: subTopicsId })
                                                .setOptions({ translateAliases: true });
            if (_.isNil(subTopicsData)) return errorRes(reply, 400, null, null);
            insertion.subTopicsId = subTopicsId;
        }

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

        // Update database
        const query = {
            threadsId: threadsId,
        }
        const options = {
            translateAliases: true,
            new: true,
            // includeResultMetadata: true,
        }
        threadsData = await Threads.findOneAndUpdate(query, insertion, options)
                                    .populate({ path: "creator", select: "username" })
                                    .populate({ path: "updater", select: "username" })
                                    .populate({ path: "subTopics", 
                                        select: [
                                            "topicsId", 
                                            "title", 
                                            "description",
                                            "like"
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
                                    .select("-__v");
        if (_.isNil(threadsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully update threads.", threadsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}