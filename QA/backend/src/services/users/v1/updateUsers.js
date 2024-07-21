"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId
        const usersId = new mongoose.Types.ObjectId(body.usersId);
        if (!mongoose.Types.ObjectId.isValid(usersId)) return errorRes(reply, 400, null, null);

        let insertion = {
            updatedBy: new mongoose.Types.ObjectId(jwtPayload.userId)
        };
        if (!(_.isNil(body.username))) insertion.username = body.username;
        // if (!(_.isNil(body.email))) insertion.email = body.email;
        if (!(_.isNil(body.profilePicture))) insertion.profilePicture = body.profilePicture;

        // Check if data exists and make sure only original user can change their own profile
        let usersData = await Users.findOne(Users.translateAliases({ usersId: usersId  }));
        if (_.isNil(usersData)) return errorRes(reply, 400, "User does not exists.", null);
        let checkOrigin = await Users.findOne({ usersId: jwtPayload.userId })
                                    .setOptions({ translateAliases: true });
        if (checkOrigin.usersId.toString() !== usersData.usersId.toString()) return errorRes(reply, 403, null, null);

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

        return res(reply, 200, "Successfully update user.", usersData);
    } catch (err) {
        console.log(err);
        if (err.codeName === "DuplicateKey") return errorRes(reply, 422, null, null);
        return errorRes(reply, 500, null, err);
    }
}