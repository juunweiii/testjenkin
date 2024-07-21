"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;
    const enumFields = [
        "usersId",
        "username",
        "email",
        "isBanned",
        "role",
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
    ];
    const enumOrder = [
        "asc",
        "desc",
        "ascending",
        "descending",
    ];

    try {
        // Pagination and filter options
        const limit = query.limit || 0;
        const offset = query.offset || 0;
        const sortField = query.sortField || "usersId";
        const sortOrder = query.sortOrder || "asc";

        // Pagination checks
        if (!_.includes(enumFields, sortField)) return errorRes(reply, 400, null, null);
        if (!_.includes(enumOrder, sortOrder)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(limit)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(offset)) return errorRes(reply, 400, null, null);

        // Escape special characters for search filter
        let username = query.username || "";
        username = username.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, "\\$&");

        // Query db
        let sortObj = { [ sortField ]: sortOrder };
        const options = { translateAliases: true };
        const usersData = await Users.find({ username: { $regex: `${username}`, $options: "i" } })
                                        .select("-password -createdBy -updatedBy -updatedAt")
                                        .limit(limit)
                                        .skip(offset)
                                        .sort(sortObj)
                                        .setOptions(options);
        const total = await Users.countDocuments({ username: { $regex: `${username}`, $options: "i" } });
        if (( _.isNil(usersData)) || (_.isNil(total))) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully retrieved all data.", { total: total, result: usersData });
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}