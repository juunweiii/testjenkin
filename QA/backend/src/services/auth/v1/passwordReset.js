"use strict"

const { TOTP } = require("totp-generator");

// Logic for handling password reset
module.exports = async function (req, reply) {
    // Extract required tools
    const getPasswordResetCache = req.reqUtils.redisCache.getPasswordResetCache;
    const setPasswordResetCache = req.reqUtils.redisCache.setPasswordResetCache;
    const nodemailerMg = req.reqUtils.nodemailerMg;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body;

    try {
        // Format req data
        let reqData = {};
        if (!(_.isNil(body.email))) reqData.email = body.email;
        
        // Check for cookie header
        if (!(_.isNil(req.headers.cookie))) {
            if (!_.isNil(req.headers.jwtPayload)) {
                let jwtPayload = req.headers.jwtPayload;
                reqData.usersId = jwtPayload.userId;
            }
        } else { reqData.usersId = null }

        // Check if data exists in cache
        let passwordData = await getPasswordResetCache(reqData);
        if (passwordData.status) return errorRes(reply, 422, "Awaiting OTP verification.", null);     

        // Find user entry and compare hash
        let dbData;
        if (_.isNil(reqData.usersId)) {
            dbData = await Users.find()
                            .where({ email: reqData.email })
                            .setOptions({ translateAliases: true });
        } else {
            dbData = await Users.find()
                            .or([ 
                                { email: reqData.email }, 
                                { usersId: reqData.usersId },
                            ])
                            .setOptions({ translateAliases: true });
        }

        if (_.isEmpty(dbData)) return errorRes(reply, 400, null, null);
        // Return error if banned
        if(dbData[0].isBanned) return errorRes(reply, 403, "User account is banned.", null);

        // Generate otp
        const { otp, expires } = TOTP.generate(process.env.TOTP_KEY, {
            digits: 8,
            algorithm: process.env.TOTP_ALG,
            period: 10,
        });
        
        // Store in redis login
        dbData[0].otp = Number(otp);
        passwordData = await setPasswordResetCache({
            usersId: String(dbData[0].usersId),
            email: dbData[0].email,
            otp: dbData[0].otp
        });
        if (!passwordData) return errorRes(reply, 500, null, null);

        // Send out email OTP
        nodemailerMg.sendMail({
            from: "otp@mail.threadhub.systems",
            to: dbData[0].email,
            subject: `2FA OTP: ${process.env.NODE_ENV}`,
            text: `PASSWORD RESET: 2FA OTP expires in 10 mins: ${otp}`,
        }, (err, info) => {
            if (err) {
                console.log(err);
                return errorRes(reply, 500, "Could not send to specified email.", err);
            }
            console.log("Email sent successfully: ", info);
            req.log.info(info);
        });

        return res(reply, 200, "Password Reset OTP has been sent to your email (10mins). Check your spam folder for email.")
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}