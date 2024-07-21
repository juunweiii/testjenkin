"use strict"

module.exports = async function(req, reply) {
    const mongoose = req.reqUtils.mongoose;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const SubTopics = model.subTopicsModel;
    const Threads = model.threadsModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    const query = req.query;
    const enumFields = [
        "threadsId",
        "content",
        "subTopicsId",
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
        let filter = {};
        const limit = query.limit || 0;
        const offset = query.offset || 0;
        const sortField = query.sortField || "threadsId";
        const sortOrder = query.sortOrder || "asc";

        // Pagination checks
        if (!_.includes(enumFields, sortField)) return errorRes(reply, 400, null, null);
        if (!_.includes(enumOrder, sortOrder)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(limit)) return errorRes(reply, 400, null, null);
        if (!_.isInteger(offset)) return errorRes(reply, 400, null, null);
        if (!_.isNil(query.subTopicsId)) {
            const id = new mongoose.Types.ObjectId(query.subTopicsId);
            if (!mongoose.Types.ObjectId.isValid(id)) return errorRes(reply, 400, null, null);
            const checkTopics = await SubTopics.exists({ subTopicsId: id })
                                            .setOptions({ translateAliases: true });
            if (_.isNil(checkTopics)) return errorRes(reply, 400, null, null);
            filter.subTopicsId = id;
        }

        // Escape special characters for search filter
        let content = query.content || "";
        content = content.replace(/[&\/\\#,+()$~%.'":*<>{}]/g, "\\$&");

        // Query db
        let sortObj = { [ sortField ]: sortOrder };
        const options = { translateAliases: true };
        let threadsData;
        let total;
        if (_.isEmpty(filter)) {
            threadsData = await Threads.find({ content: { $regex: `${content}`, $options: "i" } })
                                        // .select("-createdBy -updatedBy -createdAt")
                                        .populate({ path: "creator", select: "username isBanned role profilePicture" })
                                        // .populate({ path: "updater", select: "username isBanned role profilePicture" })
                                        .populate({ path: "subTopics", 
                                            select: [
                                                "subTopicsId", 
                                                "title", 
                                                "description"
                                            ],
                                            // populate: {
                                            //     path: "topics",
                                            //     select: [
                                            //         "title",
                                            //         "description"
                                            //     ]
                                            // } 
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "likers",
                                                select: "username isBanned role profilePicture" 
                                            } 
                                        })
                                        .populate({ path: "like", 
                                            populate: { 
                                                path: "dislikers",
                                                select: "username isBanned role profilePicture" 
                                            } 
                                        })
                                        .limit(limit)
                                        .skip(offset)
                                        .sort(sortObj)
                                        .setOptions(options);
            total = await Threads.countDocuments({ content: { $regex: `${content}`, $options: "i" } });
        } else {
            threadsData = await Threads.find(filter)
            // .select("-createdBy -updatedBy -createdAt")
            .populate({ path: "creator", select: "username isBanned role profilePicture" })
            // .populate({ path: "updater", select: "username isBanned role profilePicture" })
            .populate({ path: "subTopics", 
                select: [
                    "subTopicsId", 
                    "title", 
                    "description"
                ],
                // populate: {
                //     path: "topics",
                //     select: [
                //         "title",
                //         "description"
                //     ]
                // } 
            })
            .populate({ path: "like", 
                populate: { 
                    path: "likers",
                    select: "username isBanned role profilePicture" 
                } 
            })
            .populate({ path: "like", 
                populate: { 
                    path: "dislikers",
                    select: "username isBanned role profilePicture" 
                } 
            })
            .limit(limit)
            .skip(offset)
            .sort(sortObj)
            .setOptions(options);
            total = await Threads.countDocuments(filter);
        }
        if (( _.isNil(threadsData)) || (_.isNil(total))) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully retrieved all data.", { total: total, result: threadsData });
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}