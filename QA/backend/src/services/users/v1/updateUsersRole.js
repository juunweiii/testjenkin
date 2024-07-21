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
    const enumRole = ["moderator", "user"];

    try {
        // Make sure _id is ObjectId
        const usersId = new mongoose.Types.ObjectId(body.usersId);
        if (!mongoose.Types.ObjectId.isValid(usersId)) return errorRes(reply, 400, null, null);

        let insertion = {
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId)
        };
        if (!(_.isNil(body.role))) {
            if (!(_.includes(enumRole, body.role))) return errorRes(reply, 400, null, null);
            insertion.role = body.role;
        }

        // Check if data exists and make sure only admin can promote/demote
        let usersData = await Users.findOne(Users.translateAliases({ usersId: usersId  }));
        if (_.isNil(usersData)) return errorRes(reply, 400, "User does not exists.", null);
        if (usersData.role === "admin") return errorRes(reply, 400, "Admin cannot be modified", null);
        let checkOrigin = await Users.findOne({ usersId: jwtPayload.userId })
                                    .setOptions({ translateAliases: true });
        if ((checkOrigin.role === "user") || (checkOrigin.role === "moderator")) return errorRes(reply, 403, null, null);

        // Update database
        const query = {
            usersId: usersId,
        }
        const options = {
            translateAliases: true,
            new: true,
            // includeResultMetadata: true,
        }
        usersData = await Users.findOneAndUpdate(query, insertion, options)
                                    .select("-__v -password");
        if (_.isNil(usersData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully update user role.", usersData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}