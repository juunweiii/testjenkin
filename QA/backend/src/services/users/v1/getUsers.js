"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const jwtPayload = req.headers.jwtPayload;
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
        
        // Query the entry
        usersData = await Users.findOne({ usersId: usersId  })
                                        .select("-password -createdBy -updatedBy -updatedAt")
                                        .setOptions(options);
        if (_.isNil(usersData)) return errorRes(reply, 502, null, null);

        // Check if jwt is original user and return full data
        if (String(usersData.usersId) === jwtPayload.userId) return res(reply, 200, "Successfully retrieved user.", usersData); 

        // Return minimal data if not original user
        const retData = {
            usersId: usersData.usersId,
            username: usersData.username,
            role: usersData.role,
            profilePicture: usersData.profilePicture,
            isBanned: usersData.isBanned,
            // createdAt: usersData.createdAt,
            // updatedAt: usersData.updatedAt,
        }
        
        return res(reply, 200, "Successfully retrieved user.", retData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}