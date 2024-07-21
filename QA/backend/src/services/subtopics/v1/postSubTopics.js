"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const SubTopics = model.subTopicsModel;
    const Topics = model.topicsModel;
    const Users = model.usersModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body


    try {
        // Check if title and topics exists in db
        const topicsId = new mongoose.Types.ObjectId(body.topicsId);
        if (!mongoose.Types.ObjectId.isValid(topicsId)) return errorRes(reply, 400, null, null);
        const topicsData = await Topics.exists({ topicsId: topicsId })
                                        .setOptions({ translateAliases: true });
        let subTopicsData = await SubTopics.exists({ $and: [
            { title: body.title },
            { topicsId: topicsId },
        ] });
        if (!_.isNil(subTopicsData)) return errorRes(reply, 422, "Subtopic exists.", null);
        if(_.isNil(topicsData)) return errorRes(reply, 400, null, null);

        // Check if jwt is admin
        // if (process.env.NODE_ENV === "production") {
        //     let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        //     if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        //     if (userData.role !== "admin") return errorRes(reply, 403, null, null); 
        // }

        // Insert into database
        const subTopics = new SubTopics({
            title: body.title,
            description: body.description,
            topicsId: topicsId,
            like: {
                count: 0,
                usersLike: [],
                usersDislike: [],
            },
            createdBy: new mongoose.Types.ObjectId(jwtPayload.userId),
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId),
        });
        subTopicsData = await subTopics.save();
        if (_.isEmpty(subTopicsData) || _.isNil(subTopicsData)) return errorRes(reply, 500, null, null);

        return res(reply, 200, "Successfully created a new subtopic.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}