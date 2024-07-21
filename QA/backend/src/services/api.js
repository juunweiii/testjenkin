"use strict"
const projectName = process.env.DBPROJECT_NAME || "ThreadHub";

module.exports = async function(req, reply) {
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    try {
        return res(reply, 200, "Server running!", {
            service: `${projectName}-${process.env.SVC_NAME}.services`,
            version: "v0.0.1",
        });
    } catch (err) {
        console.log(err);
        return errorRes(reply, 503, null, err);
    }
}