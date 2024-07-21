"use strict"


module.exports = async function(req, reply) {
    // Extract required tools
    const getLoginCache = req.reqUtils.redisCache.getLoginCache;
    const luxon = req.reqUtils.luxon;
    const createJWE = req.reqUtils.joseUtils.createJWE;
    const createJWS = req.reqUtils.joseUtils.createJWS;
    const mongoose = req.reqUtils.mongoose;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    // let body = req.body;
    let query = req.query;

    try {
        // Search redis for login and verify OTP
        let loginData = await getLoginCache({ email: query.email, otp: query.otp });
        if (!loginData.status) return errorRes(reply, 400, "Requested data is wrong.", null);

        // Convert userId into mongoose objectId
        loginData.data.userId = new mongoose.Types.ObjectId(loginData.data.userId);
        
        // Create JWE token and Sign it
        const jweObj = await createJWE(loginData.data);
        if (!jweObj.status) return errorRes(reply, 500, null, null);
        const jwsObj = await createJWS(jweObj.jwe);
        if (!jwsObj.status) return errorRes(reply, 500, null, null);
        const expSeconds = luxon.DateTime.fromJSDate(jwsObj.expire).toSeconds();

        // Set csrf token
        const csrfToken = await reply.generateCsrf({
            cookieOpts: {
                path: "/",
                // signed: true,
                httpOnly: true,
                // sameSite: "none",
                // secure: true,
                expires: jwsObj.expire,
                maxAge: expSeconds,
            }
        });
        reply.setCookie("csrf_token", csrfToken, {
            path: "/",
            // signed: true,
            httpOnly: true,
            // sameSite: "none",
            // secure: true,
            expires: jwsObj.expire,
            maxAge: expSeconds,
        });

        // Set token cookie
        reply.setCookie("jwt", jwsObj.jws, {
            path: "/",
            // signed: true,
            httpOnly: true,
            // sameSite: "none",
            // secure: true,
            expires: jwsObj.expire,
            maxAge: expSeconds,
        });

        return res(reply, 200, "Successfully authenticated."); 
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}