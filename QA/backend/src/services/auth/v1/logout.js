"use strict"


module.exports = async function(req, reply) {
    // Extract required tools
    const _ = req.reqUtils._;
    const setJwtCache = req.reqUtils.redisCache.setJwtCache;
    const getJwtCache = req.reqUtils.redisCache.getJwtCache;
    const luxon = req.reqUtils.luxon;
    const jwtPayload = req.headers.jwtPayload;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;

    try {
        // Tokenize cookie
        if (_.isNil(req.headers.cookie)) return errorRes(reply, 401, null, null);
        let cookiesArr = req.headers.cookie.split(" ");
        let jwtKeyPair;
        cookiesArr.forEach((cookie, index) => {
            if ((cookie.startsWith("jwt")) || (cookie.startsWith("Jwt"))) {
                jwtKeyPair = cookie.split("=");
                if (jwtKeyPair[1].endsWith(";")) {
                    jwtKeyPair[1] = jwtKeyPair[1].substring(0, jwtKeyPair[1].length - 1);
                }
            }
        });
        if (_.isNil(jwtKeyPair)) return errorRes(reply, 401, null, null);
        const jws = jwtKeyPair[1];

        // Check duplication in cache
        let jwtData = await getJwtCache({ tokenId: jws });
        if (jwtData.status) return errorRes(reply, 400, null, null);

        // Get jwt and blacklist it
        const exp = luxon.DateTime.fromSeconds(jwtPayload.exp).toSeconds();
        jwtData = await setJwtCache({
            tokenId: jws,
            expiryTime: exp,
        });
        if (!jwtData.status) return errorRes(reply, 502, null, null);

        // Clear cookie header
        const now = luxon.DateTime.now();
        reply.clearCookie("jwt", { 
            path: "/",
            expires: now.toJSDate(),
            maxAge: now.toSeconds(),
        });
        reply.clearCookie("csrf_token", { 
            path: "/",
            expires: now.toJSDate(),
            maxAge: now.toSeconds(),
        });
        reply.clearCookie("_csrf", { 
            path: "/",
            expires: now.toJSDate(),
            maxAge: now.toSeconds(),
        });

        return res(reply, 200, "Successfully logout.");
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}