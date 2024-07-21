"use strict"

module.exports = async function(req, reply) {
    const _ = req.reqUtils._;
    const mongoose = req.reqUtils.mongoose;
    const model = req.reqUtils.model;
    const Topics = model.topicsModel;
    const Users = model.usersModel;
    const SubTopics = model.subTopicsModel;
    const Threads = model.threadsModel;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body

    try {
        // Make sure _id is ObjectId and no double truths
        const threadsId = new mongoose.Types.ObjectId(body.threadsId);
        if (!mongoose.Types.ObjectId.isValid(threadsId)) return errorRes(reply, 400, null, null);
        if (body.like && body.dislike) return errorRes(reply, 400, "Only like, dislike or neither.", null);

        // Check if data exists
        let threadsData = await Threads.findOne(Threads.translateAliases({ threadsId: threadsId  }));
        if (_.isNil(threadsData)) return errorRes(reply, 400, "Thread does not exists.", null);


        // Check if jwt is admin or is original user
        // let userData = await Users.findOne({ _id: new mongoose.Types.ObjectId(jwtPayload.userId) });
        // if (_.isNil(userData)) return errorRes(reply, 401, null, null);
        // if ((userData.role !== "admin") || (String(userData.usersId) != jwtPayload.userId )) { return errorRes(reply, 403, null, null); }

        // Update database
        let likeObj = threadsData.like;
        let insertion = {
            count: likeObj.count,
            usersLike: likeObj.usersLike,
            usersDislike: likeObj.usersDislike,
        };
        if (body.like) {
            // Add if like
            if (!_.includes(likeObj.usersLike.toString(), jwtPayload.userId)) {
                insertion.usersLike = _.concat(likeObj.usersLike, new mongoose.Types.ObjectId(jwtPayload.userId));
            }
        } else {
            // Remove if not like
            if (_.includes(likeObj.usersLike.toString(), jwtPayload.userId)) {
                insertion.usersLike = _.remove(likeObj.usersLike, function(val) {
                    return !(val.toString() === jwtPayload.userId);
                });
            }
        }
        if (body.dislike) {
            // Add if dislike
            if (!_.includes(likeObj.usersDislike.toString(), jwtPayload.userId)) {
                insertion.usersDislike = _.concat(likeObj.usersDislike, new mongoose.Types.ObjectId(jwtPayload.userId));
            }
        } else {
            // Remove if dislike
            if (_.includes(likeObj.usersDislike.toString(), jwtPayload.userId)) {
                insertion.usersDislike = _.remove(likeObj.usersDislike, function(val) {
                    return !(val.toString() === jwtPayload.userId);
                });
            }
        }

        // Check for duplication and recalculate count
        if (_.uniq(insertion.usersLike).length !== insertion.usersLike.length) return errorRes(reply, 400, "Duplication in likes.", null);
        if (_.uniq(insertion.usersDislike).length !== insertion.usersDislike.length) return errorRes(reply, 400, "Duplication in likes.", null);
        insertion.count = insertion.usersLike.length - insertion.usersDislike.length

        const query = {
            threadsId: threadsId,
        }
        const options = {
            translateAliases: true,
            new: true,
            // includeResultMetadata: true,
        };
        const nestedInsertion = {
            like: insertion
        };
        threadsData = await Threads.findOneAndUpdate(query, nestedInsertion, options)
                                    .populate({ path: "creator", select: "username" })
                                    .populate({ path: "updater", select: "username" })
                                    .populate({ path: "subTopics", 
                                        select: [
                                            "topicsId", 
                                            "title", 
                                            "description"
                                        ] 
                                    })
                                    .populate({ path: "like", 
                                        populate: { 
                                            path: "likers",
                                            select: "username" 
                                        } 
                                    })
                                    .populate({ path: "like", 
                                        populate: { 
                                            path: "dislikers",
                                            select: "username" 
                                        } 
                                    })
                                    .select("-__v");
        if (_.isNil(threadsData)) return errorRes(reply, 502, null, null);

        return res(reply, 200, "Successfully update thread's like(s).", threadsData);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}