"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
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
        
        let insertion = {
            title: body.title,
            description: body.description,
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId)
        };
        if (!(_.isNil(body.topicsId))) {
            const topicsId = new mongoose.Types.ObjectId(body.topicsId);
            if (!mongoose.Types.ObjectId.isValid(topicsId)) return errorRes(reply, 400, null, null);
            const topicsData = await Topics.exists({ topicsId: topicsId })
                                            .setOptions({ translateAliases: true });
            if (_.isNil(topicsData)) return errorRes(reply, 400, null, null);
            insertion.topicsId = topicsId;
        }


        // Check if data exists
        let subTopicsData = await SubTopics.findOne(SubTopics.translateAliases({ subTopicsId: subTopicsId  }));
        if (_.isNil(subTopicsData)) return errorRes(reply, 400, "Subtopic does not exists.", null);

        // Check if jwt is moderator or is original user
        let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        if (userData.role !== "moderator") {
            if ( String(subTopicsData.createdBy) !== jwtPayload.userId) {
                return errorRes(reply, 403, null, null);
            }
        }

        // Update database
        const query = {
            subTopicsId: subTopicsId,
        }
        const options = {
            translateAliases: true,
            new: true,
            // includeResultMetadata: true,
        }
        subTopicsData = await SubTopics.findOneAndUpdate(query, insertion, options)
                                    .populate({ path: "creator", select: "username" })
                                    .populate({ path: "updater", select: "username" })
                                    .populate({ path: "topics", 
                                        select: [
                                            "topicsId", 
                                            "title", 
                                            "description"
                                        ] 
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
        if (_.isNil(subTopicsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully update subtopic.", subTopicsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}