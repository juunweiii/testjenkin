"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const SubTopics = model.subTopicsModel;
    const Threads = model.threadsModel;
    const Users = model.usersModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body


    try {
        // Check if subTopics exists in db and content not null
        if (_.isNil(body.content)) return errorRes(reply, 400, "Content cannot be empty.", null);
        const subTopicsId = new mongoose.Types.ObjectId(body.subTopicsId);
        if (!mongoose.Types.ObjectId.isValid(subTopicsId)) return errorRes(reply, 400, null, null);
        const subTopicsData = await SubTopics.exists({ subTopicsId: subTopicsId })
                                        .setOptions({ translateAliases: true });
        if(_.isNil(subTopicsData)) return errorRes(reply, 400, null, null);

        // Check if jwt is admin
        // if (process.env.NODE_ENV === "production") {
        //     let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        //     if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        //     if (userData.role !== "admin") return errorRes(reply, 403, null, null); 
        // }

        // Insert into database
        const threads = new Threads({
            content: body.content,
            subTopicsId: subTopicsId,
            like: {
                count: 0,
                usersLike: [],
                usersDislike: [],
            },
            createdBy: new mongoose.Types.ObjectId(jwtPayload.userId),
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId),
        });
        let threadsData = await threads.save();
        if (_.isEmpty(threadsData) || _.isNil(threadsData)) return errorRes(reply, 500, null, null);

        return res(reply, 200, "Successfully created a new thread.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}