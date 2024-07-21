import Redis from "ioredis";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();



const login = async function(email, password) {
    let data = await fetch("http://localhost:3010/api/auth/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
    });
    return data.ok;
}

const loginOTP = async function(email, otp) {
    let data = await fetch("http://localhost:3010/api/auth/v1/loginOTP?" + new URLSearchParams({
        email: email,
        otp: otp,
    }).toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return data;
}

const getOTP = async function(email) {
    const redisClient = new Redis({
        host: "localhost",
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    });

    const keys = await redisClient.keys("login:*");
    for (const key of keys) {
        const keyType = await redisClient.type(key);

        if (keyType === "ReJSON-RL") {
            const jsonData = await redisClient.call("JSON.GET", key, ".");
            const data = JSON.parse(jsonData);
            
            if (data.email === email) {
                return data.otp;
            }
        }
    }
}

const cookieSplitter = async function(headers) {
    let csrfSecret = "";
    let csrfToken = "";
    let jwt = "";
    for (const [key, value] of headers) {
        if (key === "set-cookie") {
            const cookieParts = value.split(",");
            for (const part of cookieParts) {
                if (part.includes("_csrf")) {
                    const attributes = part.split(";");
                    const token = attributes[0].split("=");
                    csrfSecret = token[1];
                }
                if (part.includes("csrf_token")) {
                    const attributes = part.split(";");
                    const token = attributes[0].split("=");
                    csrfToken = token[1];
                }
                if (part.includes("jwt")) {
                    const attributes = part.split(";");
                    const token = attributes[0].split("=");
                    jwt = token[1];
                }
            }
        }
    }
    return { jwt: jwt, csrfToken: csrfToken, csrfSecret: csrfSecret };
}

export default async function() {
    let ADMIN_JWT = "";
    let ADMIN_CSRF_TOKEN = "";
    let ADMIN_CSRF_SECRET = "";
    let MOD_JWT = "";
    let MOD_CSRF_TOKEN = "";
    let MOD_CSRF_SECRET = "";
    let USER_JWT = "";
    let USER_CSRF_TOKEN = "";
    let USER_CSRF_SECRET = "";
    let adminResult = await login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD_SWAGGER)
    if (adminResult) {
        let otp = await getOTP(process.env.ADMIN_EMAIL);
        if (otp === null) console.log("login failed");
        let result = await loginOTP(process.env.ADMIN_EMAIL, otp);
        if (result.ok) {
            let headers = result.headers;
            let cookieObj = await cookieSplitter(headers);
            ADMIN_JWT = cookieObj.jwt;
            ADMIN_CSRF_TOKEN = cookieObj.csrfToken;
            ADMIN_CSRF_SECRET = cookieObj.csrfSecret;
        }
    }
    let modResult = await login(process.env.MOD_EMAIL, process.env.MOD_PASSWORD_SWAGGER)
    if (modResult) {
        let otp = await getOTP(process.env.MOD_EMAIL);
        if (otp === null) console.log("login failed");
        let result = await loginOTP(process.env.MOD_EMAIL, otp);
        if (result.ok) {
            let headers = result.headers;
            let cookieObj = await cookieSplitter(headers);
            MOD_JWT = cookieObj.jwt;
            MOD_CSRF_TOKEN = cookieObj.csrfToken;
            MOD_CSRF_SECRET = cookieObj.csrfSecret;
        }
    }
    let userResult = await login(process.env.USER_EMAIL, process.env.USER_PASSWORD_SWAGGER)
    if (userResult) {
        let otp = await getOTP(process.env.USER_EMAIL);
        if (otp === null) console.log("login failed");
        let result = await loginOTP(process.env.USER_EMAIL, otp);
        if (result.ok) {
            let headers = result.headers;
            let cookieObj = await cookieSplitter(headers);
            USER_JWT = cookieObj.jwt;
            USER_CSRF_TOKEN = cookieObj.csrfToken;
            USER_CSRF_SECRET = cookieObj.csrfSecret;
        }
    }
    return {
        ADMIN_JWT: ADMIN_JWT,
        ADMIN_CSRF_TOKEN: ADMIN_CSRF_TOKEN,
        ADMIN_CSRF_SECRET: ADMIN_CSRF_SECRET,
        MOD_JWT: MOD_JWT,
        MOD_CSRF_TOKEN: MOD_CSRF_TOKEN,
        MOD_CSRF_SECRET: MOD_CSRF_SECRET,
        USER_JWT: USER_JWT,
        USER_CSRF_TOKEN: USER_CSRF_TOKEN,
        USER_CSRF_SECRET: USER_CSRF_SECRET,
    }
}

// export creds;


// export {
//     ADMIN_JWT,
//     ADMIN_CSRF_TOKEN,
//     ADMIN_CSRF_SECRET,
//     MOD_JWT,
//     MOD_CSRF_TOKEN,
//     MOD_CSRF_SECRET,
//     USER_JWT,
//     USER_CSRF_TOKEN,
//     USER_CSRF_SECRET,
// }