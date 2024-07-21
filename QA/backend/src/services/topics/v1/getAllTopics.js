"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;
    const enumFields = [
        "topicsId",
        "title",
        "description",
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
        // Pagination options
        const limit = query.limit || 0;
        const offset = query.offset || 0;
        const sortField = query.sortField || "topicsId";
        const sortOrder = query.sortOrder || "asc";

        // Pagination checks
        if (!_.includes(enumFields, sortField)) return errorRes(reply, 400, null, null);
        if (!_.includes(enumOrder, sortOrder)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(limit)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(offset)) return errorRes(reply, 400, null, null);

        // Escape special characters for search filter
        let title = query.title || "";
        title = title.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, "\\$&");

        // Query db
        let sortObj = { [ sortField ]: sortOrder };
        const options = { translateAliases: true };
        const topicsData = await Topics.find({ title: { $regex: `${title}`, $options: "i" } })
                                        .select("-createdBy -createdAt -updatedBy -updatedAt")
                                        // .populate({ path: "creator", select: "username isBanned role profilePicture" })
                                        // .populate({ path: "updater", select: "username isBanned role profilePicture" })
                                        .limit(limit)
                                        .skip(offset)
                                        .sort(sortObj)
                                        .setOptions(options);
        const total = await Topics.countDocuments({ title: { $regex: `${title}`, $options: "i" } });
        if (( _.isNil(topicsData)) || (_.isNil(total))) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully retrieved all data.", { total: total, result: topicsData });
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}