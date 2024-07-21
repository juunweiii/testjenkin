// Base imports
require("@dotenvx/dotenvx").config()
const path = require("path");
const autoload = require("@fastify/autoload");
const cors = require("@fastify/cors");
const _ = require("lodash");
const helmet = require("@fastify/helmet");
const luxon = require("luxon");


// Database initialisation
const mongoose = require("mongoose");
const model = require(path.join(__dirname, "db/model/model"));
const { createDbInstance } = require(path.join(__dirname, "db/config/mongo"));
const db = createDbInstance();

// Configs folder settings
// // Swagger configs
const { swaggerOptions } = require(path.join(__dirname, "configs/swagger"));
// // Ajv schema compiler configs
const { ajv } = require(path.join(__dirname, "configs/ajv"));
// // Log configs
const pinoConfigs = require(path.join(__dirname, "configs/pinoConfigs"));
// // Mailgun configs
const { nodemailerMg } = require(path.join(__dirname, "configs/mailgunConfig"));

// Utils folder methods
// // Response methods
const { res, errorRes } = require(path.join(__dirname, "utils/response"));
// // Logging req body method
const logReqBody = require(path.join(__dirname, "utils/logReqBody"));
// // Ajv components array
const ajvComponents = require(path.join(__dirname, "utils/ajvComponents"));


// Entry point to application
module.exports = async function (fastify, opts) {
    // Modify new ajv schema compiler
    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return ajv.compile(schema);
    });
    ajvComponents.forEach((components, index) => {
        fastify.addSchema(components);
    });

    // Use decorate to pass params down the fastify instance chain
    fastify.decorate("path", path);
    fastify.decorate("lodash", _);
    fastify.decorate("mongoose", mongoose);
    fastify.decorate("logReqBody", logReqBody);

    // Decorate all requests with additional tools
    fastify.decorateRequest("reqUtils", null);
    fastify.addHook("onRequest", async (req, reply) => {
        req.reqUtils = {
            mongoose: mongoose,
            model: model,
            path: path,
            nodemailerMg: nodemailerMg,
            luxon: luxon,
            _: _,
        };
    });

    fastify.decorateReply("replyUtils", null);
    fastify.addHook("onRequest", async(req, reply) => {
        reply.replyUtils = {
            res: res,
            errorRes: errorRes,
        };
    });

    // Load redis configs and utils
    fastify.register(require(path.join(__dirname, "db/config/redis")));
    fastify.register(require(path.join(__dirname, "db/model/redisRepo")));
    fastify.register(require(path.join(__dirname, "utils/cache")));

    // Cookie helpers
    fastify.register(require("@fastify/cookie"), {
        secret: [process.env.COOKIE_SECRET, process.env.COOKIE_NEXT_SECRET],
        algorithm: process.env.COOKIE_ALG,
    });
    fastify.register(require("@fastify/csrf-protection"), {
        getToken: function(req) { 
            let cookies = req.headers.cookie.split(" ");
            for (let i = 0; i < cookies.length; i++) {
                if (( cookies[i].startsWith("Csrf-Token") ) || ( cookies[i].startsWith("csrf_token") )) {
                    let csrfKeyPair = cookies[i].split("=");
                    if (csrfKeyPair[1].endsWith(";")) {
                        csrfKeyPair[1] = csrfKeyPair[1].substring(0, csrfKeyPair[1].length - 1);
                    }
                    return csrfKeyPair[1];
                }
            }
            // return req.headers["Csrf-Token", "csrf-token"] 
        }
    });

    // Authorization helpers
    fastify.register(require(path.join(__dirname, "casbin/casbin")));
    fastify.register(require(path.join(__dirname, "utils/authorization")));

    // Jwt Auth helpers
    fastify.register(require("@fastify/auth"));
    fastify.register(require(path.join(__dirname, "utils/jose")));

    // Check ban of accounts helper
    fastify.register(require(path.join(__dirname, "utils/checkBan")));

    // Allow frontend to connect to backend from different domain
    // https://github.com/fastify/fastify-cors for documentations
    let allowedOrigins = [];
    if (process.env.NODE_ENV === "production") {
      allowedOrigins = [
        "https://threadhub.systems",
      ];
    } else {
        allowedOrigins = [
            "http://127.0.0.1:3010",
            "http://localhost:3010",
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "https://threadhub.systems",
        ];
    }
    fastify.register(cors, {
        origin: allowedOrigins,
        // methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        credentials: true,
        exposedHeaders: ["set-cookie", "Set-Cookie"],
    });

    // Helmet headers protection
    fastify.register(helmet, { global: true })

    // Circuit breaker pattern to protect API routes
    fastify.register(require("@fastify/circuit-breaker"), {
        timeout: 5000,
        resetTimeout: 5000,
        onCircuitOpen: async (req, reply) => {
            const errData = new Error("Circuit left open", req);
            return errorRes(reply, 503, null, errData);
        },
        onTimeout: async (req, reply) => {
            const errData = new Error("An API service timeout", req);
            return errorRes(reply, 504, null, errData);
        }
    });

    // Register swagger docs into usable routes
    if ((process.env.NODE_ENV == "development") || (process.env.NODE_ENV == "staging")) {
        await fastify.register(require("@fastify/swagger"), swaggerOptions);
        await fastify.register(require("@fastify/swagger-ui"), {
            routePrefix: "/docs",
            uiConfig: {
                docExpansion: "full",
                deepLinking: false
            },
            staticCSP: true,
            transformStaticCSP: (header) => header,
            transformSpecification: (swaggerObject, req, reply) => { return swaggerObject },
            transformSpecificationClone: true,
        });
    }

    // Add rate limiting
    await fastify.register(require(path.join(__dirname, "configs/redisRateLimit")));
    await fastify.register(require("@fastify/rate-limit"), {
        max: 50,//50
        ban: 5,
        timeWindow: "1m",//5m
        redis: fastify.redisRateLimit,
        onBanReach: function(req, key) {
            fastify.log.info(req, "Brute force attempt");
        }
    });

    // Load all plugins in services directory
    fastify.register(autoload, {
        dir: path.join(__dirname, "services"),
        options: Object.assign({ prefix: "/api" }, opts)
    });

    // Gracefully shutdown server
    process.on("SIGINT", function() {
        process.exit(1);
    });
}

// Dynamic chaning of log server ip
// DO NOT REMOVE
process.env.LOG_SERVER_IP = process.env.LOG_SERVER_IP;

// Additional options for fastify
module.exports.options = {
    // Uncomment to test HTTPS / HTTP2 (currently not configured) connection
    // http2: true,
    // https: {
    //     allowHTTP1: true,
    //     key: Buffer.from(process.env.HTTPS_KEY, "base64"),
    //     cert: Buffer.from(process.env.HTTPS_CERT, "base64")
    // },
    logger: pinoConfigs[process.env.NODE_ENV] ?? pinoConfigs["development"]
}
