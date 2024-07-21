"use strict"

const { TOTP } = require("totp-generator");
const argon2 = require("argon2");

// Logic for handling registeration of account to send OTP
module.exports = async function (req, reply) {
    // Extract required tools
    const getUsersCache = req.reqUtils.redisCache.getUsersCache;
    const setUsersCache = req.reqUtils.redisCache.setUsersCache;
    const getRegisterCache = req.reqUtils.redisCache.getRegisterCache;
    const setRegisterCache = req.reqUtils.redisCache.setRegisterCache;
    const nodemailerMg = req.reqUtils.nodemailerMg;
    const model = req.reqUtils.model;
    const Users = model.usersModel;
    const _ = req.reqUtils._;
    const res = reply.replyUtils.res;
    const errorRes = reply.replyUtils.errorRes;
    let body = req.body;

    try {
        // // Search redis for cache
        // let userCacheData = await getUsersCache({
        //     // username: body.username, 
        //     email: body.email
        // });
        // if (userCacheData.status) return errorRes(reply, 422, userCacheData.message, null);

        // Check duplicate in database
        let userDbData = await Users.exists({ username: body.username });
        if (!_.isNil(userDbData)) return errorRes(reply, 422, "Username/email exists.", null);
        userDbData = await Users.find().or([{ email: body.email }]);
        if (userDbData.length > 0) {
            // Cache duplicate if exists
            // let userCacheData = await setUsersCache({
            //     userId: String(userDbData[0]._id), 
            //     username: userDbData[0].username, 
            //     email: userDbData[0].email,
            // });
            if (userCacheData.status) return errorRes(reply, 422, "Username/email exists.", null);
        }

        // Check redis for temp register
        let registerData = await getRegisterCache({
            username: body.username,
            email: body.email,
        });
        if (registerData.status) return errorRes(reply, 422,"Awaiting OTP verification.", null);

        // Check password complexity
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!-~])[A-Za-z\\d!-~]{8,}$")
        if (!passwordRegex.test(body.password)) {
            return errorRes(reply, 400, "Password complexity not matched. Minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number and 1 special character.", null);
        }

        // Hash password
        let passwordHash = await argon2.hash(body.password, { secret: Buffer.from(process.env.ARGON2_SECRET) });
        body.password = passwordHash;
        
        // Generate otp
        const { otp, expires } = TOTP.generate(process.env.TOTP_KEY, {
            digits: 8,
            algorithm: process.env.TOTP_ALG,
            period: 10,
        });        

        // Store in redis register
        body.otp = Number(otp);
        registerData = await setRegisterCache(body);
        if (!registerData.status) return errorRes(reply, 500, null, null);

        // Send out email OTP
        nodemailerMg.sendMail({
            from: "otp@mail.threadhub.systems",
            to: body.email,
            subject: `2FA OTP: ${process.env.NODE_ENV}`,
            text: `REGISTER: 2FA OTP expires in 10 mins: ${otp}`
        }, (err, info) => {
            if (err) {
                console.log(err);
                return errorRes(reply, 500, "Could not send to specified email.", err);
            }
            console.log("Email sent successfully: ", info);
            req.log.info(info)
        });

        return res(reply, 200, "Temporarily registered, please enter OTP sent to your email (10mins). Check your spam folder for email.")

    } catch (err) {
        console.log(err);
        return errorRes(reply, 500, null, err);
    }
}