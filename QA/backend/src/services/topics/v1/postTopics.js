"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
    const Users = model.usersModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body


    try {
        // Check if title exists in db
        let topicsData = await Topics.exists({ title: body.title });
        if (!_.isNil(topicsData)) return errorRes(reply, 422, "Topic exists.", null);

        // Check if jwt is admin
        // if (process.env.NODE_ENV === "production") {
        //     let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        //     if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        //     if (userData.role !== "admin") return errorRes(reply, 403, null, null); 
        // }

        // Insert into database
        const topic = new Topics({
            title: body.title,
            description: body.description,
            createdBy: new mongoose.Types.ObjectId(jwtPayload.userId),
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId),
        });
        topicsData = await topic.save();
        if (_.isEmpty(topicsData) || _.isNil(topicsData)) return errorRes(reply, 500, null, null);

        return res(reply, 200, "Successfully created a new topic.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}