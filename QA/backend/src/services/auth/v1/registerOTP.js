"use strict"

const { default: mongoose } = require("mongoose");

// Logic for handling registeration of account after verifying OTP
module.exports = async function (req, reply) {
    // Extract required tools
    const getRegisterCache = req.reqUtils.redisCache.getRegisterCache;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    // const body = req.body;
    const query = req.query

    try {
        // Search redis for temp register and verify OTP
        let registerData = await getRegisterCache({ email: query.email, otp: query.otp });
        if (!registerData.status) return errorRes(reply, 400, "Requested data is wrong.", null);

        // Model from body
        const user = new Users({
            username: registerData.data.username,
            password: registerData.data.password,
            profilePicture: registerData.data.profilePicture,
            email: registerData.data.email,
            isBanned: false,
            createdBy: "system",
            updatedBy: new mongoose.Types.ObjectId(), // used as placeholder
            role: "user",
        });


        // Insert into db
        let data = await user.save();
        if (_.isEmpty(data)) return errorRes(reply, 500, null, null);

        // Change updatedBy to itself
        data = await Users.findOneAndUpdate({ usersId: user.usersId }, { updatedBy: user.usersId })
                                .setOptions({ translateAliases: true });

        return res(reply, 200, "Successfully added into database");
    } catch (err) {
        console.log(err);
        if (err.code == 11000 && err.errorResponse.errmsg.includes("duplicate key error")) {
            return errorRes(reply, 422, "Entry exists in database", err);
        }
        return errorRes(reply, 500, null, err);
    }

}