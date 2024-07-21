"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const SubTopics = model.subTopicsModel;
    const Topics = model.topicsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;
    const enumFields = [
        "subTopicsId",
        "title",
        "description",
        "topicsId",
        "like.count",
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
        let filter = {}
        const limit = query.limit || 0;
        const offset = query.offset || 0;
        const sortField = query.sortField || "subTopicsId";
        const sortOrder = query.sortOrder || "asc";

        // Pagination checks
        if (!_.includes(enumFields, sortField)) return errorRes(reply, 400, null, null);
        if (!_.includes(enumOrder, sortOrder)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(limit)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(offset)) return errorRes(reply, 400, null, null);
        if (!_.isNil(query.topicsId)) {
            const id = new mongoose.Types.ObjectId(query.topicsId);
            if (!mongoose.Types.ObjectId.isValid(id)) return errorRes(reply, 400, null, null);
            const checkTopics = await Topics.exists({ topicsId: id })
                                            .setOptions({ translateAliases: true });
            if (_.isNil(checkTopics)) return errorRes(reply, 400, null, null);
            filter.topicsId = id;
        }

        // Escape special characters for search filter
        let title = query.title || "";
        title = title.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, "\\$&");

        // Query db
        let sortObj = { [sortField]: sortOrder };
        const options = { translateAliases: true };
        let topicsData;
        let total;
        if (_.isEmpty(filter)) {
            topicsData = await SubTopics.find({ title: { $regex: `${title}`, $options: "i" } })
                .populate({ path: "creator", select: "username isBanned role profilePicture" })
                // .populate({ path: "updater", select: "username isBanned role profilePicture" })
                // .populate({
                //     path: "topics",
                //     select: [
                //         "topicsId",
                //         "title",
                //         "description"
                //     ]
                // })
                .populate({
                    path: "like",
                    populate: {
                        path: "likers",
                        select: "username isBanned role profilePicture"
                    }
                })
                .populate({
                    path: "like",
                    populate: {
                        path: "dislikers",
                        select: "username isBanned role profilePicture"
                    }
                })
                // .select("-createdAt -createdBy -updatedBy")
                .limit(limit)
                .skip(offset)
                .sort(sortObj)
                .setOptions(options);
            total = await SubTopics.countDocuments({ title: { $regex: `${title}`, $options: "i" } });
        } else {
            topicsData = await SubTopics.find(filter)
                .populate({ path: "creator", select: "username isBanned role profilePicture" })
                // .populate({ path: "updater", select: "username isBanned role profilePicture" })
                // .populate({
                //     path: "topics",
                //     select: [
                //         "topicsId",
                //         "title",
                //         "description"
                //     ]
                // })
                .populate({
                    path: "like",
                    populate: {
                        path: "likers",
                        select: "username isBanned role profilePicture"
                    }
                })
                .populate({
                    path: "like",
                    populate: {
                        path: "dislikers",
                        select: "username isBanned role profilePicture"
                    }
                })
                // .select("-createdAt -createdBy -updatedBy")
                .limit(limit)
                .skip(offset)
                .sort(sortObj)
                .setOptions(options);
            total = await SubTopics.countDocuments(filter);
        }
        if ((_.isNil(topicsData)) || (_.isNil(total))) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully retrieved all data.", { total: total, result: topicsData });
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}