"use strict"

const path = require("path");
const fp = require("fastify-plugin");
const jose = require("jose");
const luxon = require("luxon");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

let data = {
    status: true,
}

const createTimer = async function() {
    const now = luxon.DateTime.now().toJSDate();
    const expire = luxon.DateTime.now().plus({ days: process.env.JWT_DURATION }).toJSDate();
    return { now, expire }
}

// Create JWE token with role
const createJWE = async function(obj) {
    let retData = _.cloneDeep(data);
    try {
        const { now, expire } = await createTimer();
        const jwe = await new jose.EncryptJWT({
            role: obj.role,
            username: obj.username,
            email: obj.email,
            userId: String(obj.userId)
        })
            .setProtectedHeader({
                alg: process.env.JWE_ALG,
                enc: process.env.JWE_ENC,
                typ: process.env.JWE_TYP
            })
            .setIssuedAt(now)
            .setIssuer(process.env.JWT_ISSUER)
            .setJti(uuidv4())
            .setExpirationTime(expire)
            .encrypt(Buffer.from(process.env.JWE_SECRET, "base64"));

        retData.jwe = jwe;
        return retData;
    } catch (err) {
        console.log(err);
        retData.status = false;
        retData.err = err;
        return retData;
    }
}

// JWE validation
const verifyJWE = async function (jwe) {
    let retData = _.cloneDeep(data);
    try {
        const { payload, protectedHeader } = await jose.jwtDecrypt(jwe, Buffer.from(process.env.JWE_SECRET, "base64"));
        retData.protectedHeader = protectedHeader;
        retData.payload = payload;
        return retData;
    } catch (err) {
        console.log(err);
        retData.status = false;
        retData.err = err;
        return retData;
    }

}

// Create JWS token with JWE data
const createJWS = async function(jwe) {
    let retData = _.cloneDeep(data);
    try {
        const { now, expire } = await createTimer();
        const jws = await new jose.SignJWT({
            jwe: jwe
        })
            .setProtectedHeader({ alg: process.env.JWS_ALG })
            .setIssuedAt(now)
            .setIssuer(process.env.JWT_ISSUER)
            .setJti(uuidv4())
            .setExpirationTime(expire)
            .sign(Buffer.from(process.env.JWS_SECRET, "base64"));

        retData.jws = jws;
        retData.expire = expire;
        return retData;
    } catch (err) {
        console.log(err);
        retData.status = false;
        retData.err = err;
        return retData;
    }

}

// JWS validation
const verifyJWS = async function(jws) {
    let retData = _.cloneDeep(data);
    try {
        const { payload, protectedHeader } = await jose.jwtVerify(jws, Buffer.from(process.env.JWS_SECRET, "base64"));
        retData.protectedHeader = protectedHeader;
        retData.payload = payload;
        return retData;
    } catch (err) {
        console.log(err);
        retData.status = false;
        retData.err = err;
        return retData;
    }
}

// For fastify instance handling only
const jwtVerify = async function(req, reply) {
    let retData = _.cloneDeep(data);
    const errorRes = reply.replyUtils.errorRes;
    const getJwtCache = req.reqUtils.redisCache.getJwtCache;
    try {
        let jwtKeyPair;

        // Check if cookie header exists
        if (_.isNil(req.headers.cookie)) return errorRes(reply, 401, "Invalid authorization cookie.", null);
        
        // Split cookie by its own key pair values
        let cookiesArr = req.headers.cookie.split(" ");
        cookiesArr.forEach((cookie, index) => {
            if ((cookie.startsWith("jwt")) || (cookie.startsWith("Jwt"))) {
                jwtKeyPair = cookie.split("=");
                if (jwtKeyPair[1].endsWith(";")) {
                    jwtKeyPair[1] = jwtKeyPair[1].substring(0, jwtKeyPair[1].length - 1);
                }
            }
        });

        // Check if jwt cookie exists
        if (_.isNil(jwtKeyPair)) return errorRes(reply, 401, "Invalid authorization cookie.", null);
        const jws = jwtKeyPair[1];

        // Check blacklist redis
        const jwtData = await getJwtCache({ tokenId: jws });
        if (jwtData.status) return errorRes(reply, 401, "Invalid token.", null);

        // Verify JWS
        const jwsObj = await verifyJWS(jws);
        if (!jwsObj.status) return errorRes(reply, 401, "Invalid token.", null);

        // Verify JWE
        const jweObj = await verifyJWE(jwsObj.payload.jwe);
        if (!jweObj.status) return errorRes(reply, 401, "Invalid token.", null);

        // Check if token has expired
        const now = luxon.DateTime.now().toSeconds();
        if (now > jweObj.payload.exp) return errorRes(reply, 401, null, null);

        retData.status = true;
        retData.message = "Successful JWT verification.";
        retData.data = jweObj.payload;

        req.headers.jwtPayload = jweObj.payload;
        return retData;
    } catch(err) {
        console.log(err);
        retData.status = false;
        retData.err = err;
        return errorRes(reply, 500, null, err);
    }
}

module.exports = fp(async function(fastify, opts) {
    const joseUtils = {
        createJWE: createJWE,
        verifyJWE: verifyJWE,
        createJWS: createJWS,
        verifyJWS: verifyJWS,
    };
    fastify.decorate("joseUtils", "");
    fastify.decorate("jwtVerify", jwtVerify);

    fastify.addHook("onRequest", async (req, reply) => {
        fastify.joseUtils = joseUtils;
        req.reqUtils.joseUtils = joseUtils;
    });
});