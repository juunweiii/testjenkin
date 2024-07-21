"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Threads = model.threadsModel;
    const SubTopics = model.subTopicsModel;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;

    try {
        // Make sure _id is ObjectId
        const usersId = new mongoose.Types.ObjectId(query.usersId );
        if (!mongoose.Types.ObjectId.isValid(usersId)) return errorRes(reply, 400, null, null);

        // Check db if data exists
        const options = { translateAliases: true };
        let usersData = await Users.exists({ usersId: usersId })
                                    .setOptions(options); 
        if (_.isNil(usersData)) return errorRes(reply, 400, null, null);

        // Get data from subtopics and threads
        const subTopicsData = await SubTopics.find({ createdBy: usersId })
                                                .select("like")
                                                .setOptions(options);
        const threadsData = await Threads.find({ createdBy: usersId })
                                        .select("like")
                                        .setOptions(options);

        // Summation of all likes and dislikes
        let rep = 0;
        subTopicsData.forEach((data, index) => {
            rep += data.like.count;
        });
        threadsData.forEach((data, index) => {
            rep += data.like.count;
        })
        usersData.usersId = usersData._id;
        usersData.reputation = rep;    
        delete usersData._id;
    
        return res(reply, 200, "Successfully retrieved user reputation.", usersData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}