"use strict"

const { TOTP } = require("totp-generator");
const argon2 = require("argon2");

// Logic for handling login authentication
module.exports = async function (req, reply) {
    // Extract required tools
    const getLoginCache = req.reqUtils.redisCache.getLoginCache;
    const setLoginCache = req.reqUtils.redisCache.setLoginCache;
    const nodemailerMg = req.reqUtils.nodemailerMg;
    const _ = req.reqUtils._;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body;

    try {
        // Check if data exists in cache
        let loginData = await getLoginCache({
            // username: body.username,
            email: body.email
        });
        if (loginData.status) return errorRes(reply, 422, "Awaiting OTP verification.", null);     

        // Find user entry and compare hash
        let dbData = await Users.find({ email: body.email });
        if (_.isEmpty(dbData)) return errorRes(reply, 400, null, null);
        // Return error if banned
        if(dbData[0].isBanned) return errorRes(reply, 403, "User account is banned.", null);
        let verifyData = await argon2.verify(dbData[0].password, body.password, { secret: Buffer.from(process.env.ARGON2_SECRET )});
        if (!verifyData) return errorRes(reply, 401, "Invalid credentials", null);

        // Generate otp
        const { otp, expires } = TOTP.generate(process.env.TOTP_KEY, {
            digits: 8,
            algorithm: process.env.TOTP_ALG,
            period: 10,
        });
        
        // Store in redis login
        dbData[0].otp = Number(otp);
        loginData = await setLoginCache({
            userId: String(dbData[0]._id),
            username: dbData[0].username,
            password: dbData[0].password,
            profilePicture: dbData[0].profilePicture,
            email: dbData[0].email,
            role: dbData[0].role,
            isBanned: dbData[0].isBanned,
            otp: dbData[0].otp
        });
        if (!loginData) return errorRes(reply, 500, null, null);

        // Send out email OTP
        nodemailerMg.sendMail({
            from: "otp@mail.threadhub.systems",
            to: dbData[0].email,
            subject: `2FA OTP: ${process.env.NODE_ENV}`,
            text: `LOGIN: 2FA OTP expires in 10 mins: ${otp}`,
        }, (err, info) => {
            if (err) {
                console.log(err);
                return errorRes(reply, 500, "Could not send to specified email.", err);
            }
            console.log("Email sent successfully: ", info);
            req.log.info(info);
        });

        return res(reply, 200, "Temporarily verified, please enter OTP sent to your email (10mins). Check your spam folder for email.")
    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}