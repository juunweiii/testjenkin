"use strict"

module.exports = async function(req, reply) {
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;

    try {
        return res(reply, 200, "Authentication pass.", null);
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}