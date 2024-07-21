"use strict"

require("@dotenvx/dotenvx").config();
const path = require("path");
const { DateTime } = require("luxon");


const redactPaths = [
    // "body.username",
    "body.password",
    // "body.email",
];

const pinoConfigs = {
    development: {
        transport: {
            targets: [
                {
                    target: path.join(__dirname, "customPinoPretty"),
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        destination: 1,
                        include: "level,time,hostname,pid"
                    }
                },
                // All logs to single file (dev usage)
                { 
                    target: "pino/file",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        destination: path.join(__dirname, `../logs/fastify-${process.env.SVC_NAME}.log`),
                        mkdir: true,
                        include: "level,time,hostname,pid",
                    }
                },
                // // comment out if permission error
                // {
                //     target: "pino-roll",
                //     options: {
                //         colorize: true,
                //         translateTime: "SYS:standard",
                //         mkdir: true,
                //         include: "level,time,hostname,pid",
                //         frequency: "daily",
                //         size: "1g",
                //         file: path.join("/var/log", `ssd/fastify-${process.env.SVC_NAME}-${DateTime.now().toISO()}`),
                //         extension: ".log",
                //         limit: { count: 1000 },
                //     }
                // },
                // {
                //     target: "pino-discord-webhook",
                //     options: {
                //         webhookURL: process.env.DISCORD_WEBHOOK_URL
                //     },
                // },
                // {
                //     target: "pino-socket",
                //     options: {
                //         address: process.env.LOG_SERVER_IP,
                //         port: process.env.LOG_SERVER_PORT,
                //         mode: process.env.LOG_SERVER_MODE,
                //     }
                // },
            ],
        },
        nestedKey: "payload",
        mixin(_context, level, logger) {
            let finalData = {};
            // Add label to log data
            if (logger.hasOwnProperty("levels")) {
                let label = logger.levels.labels[level].toUpperCase();
                finalData.label = label; 
            }
            // Add header to log dataa
            if (_context.hasOwnProperty("req")) {
                let rawHeaders = _context.req.raw.rawHeaders;
                finalData.rawHeaders = rawHeaders;
            }
            return finalData;
        },
        level: process.env.PINO_LOG_LEVEL || "info",
    },

    staging: {
        transport: {
            targets: [
                {
                    target: path.join(__dirname, "customPinoPretty"),
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        destination: 1,
                        include: "level,time,hostname,pid"
                    }
                },
                // All logs to single file (dev and staging usage)
                { 
                    target: "pino/file",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        destination: path.join(__dirname, `../logs/fastify-${process.env.SVC_NAME}.log`),
                        mkdir: true,
                        include: "level,time,hostname,pid",
                    }
                },
                // Logs are rotated daily to different file (staging and prod usage)
                {
                    target: "pino-roll",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        mkdir: true,
                        include: "level,time,hostname,pid",
                        frequency: "daily",
                        size: "1g",
                        file: path.join("/var/log", `ssd/fastify-${process.env.SVC_NAME}-${DateTime.now().toISO()}`),
                        extension: ".log",
                        limit: { count: 1000 },
                    }
                },
                {
                    target: "pino-discord-webhook",
                    options: {
                        webhookURL: process.env.DISCORD_WEBHOOK_URL
                    },
                },
                // {
                //     target: "pino-socket",
                //     options: {
                //         address: process.env.LOG_SERVER_IP,
                //         port: process.env.LOG_SERVER_PORT,
                //         mode: process.env.LOG_SERVER_MODE
                //     }
                // },
            ],
        },
        nestedKey: "payload",
        mixin(_context, level, logger) {
            let finalData = {};
            // Add label to log data
            if (logger.hasOwnProperty("levels")) {
                let label = logger.levels.labels[level].toUpperCase();
                finalData.label = label; 
            }
            // Add header to log dataa
            if (_context.hasOwnProperty("req")) {
                let rawHeaders = _context.req.raw.rawHeaders;
                finalData.rawHeaders = rawHeaders;
            }
            return finalData;
        },
        level: process.env.PINO_LOG_LEVEL || "info",
    },

    production: {
        transport: {
            targets: [
                {
                    target: path.join(__dirname, "customPinoPretty"),
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        destination: 1,
                        include: "level,time,hostname,pid"
                    }
                },
                // Logs are rotated daily to different file (staging and prod usage)
                {
                    target: "pino-roll",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        mkdir: true,
                        include: "level,time,hostname,pid",
                        frequency: "daily",
                        size: "1g",
                        file: path.join("/var/log", `ssd/fastify-${process.env.SVC_NAME}-${DateTime.now().toISO()}`),
                        extension: ".log",
                        limit: { count: 1000 },
                    }
                },
                {
                    target: "pino-discord-webhook",
                    options: {
                        webhookURL: process.env.DISCORD_WEBHOOK_URL
                    },
                },
                {
                    target: "pino-socket",
                    options: {
                        address: process.env.LOG_SERVER_IP,
                        port: process.env.LOG_SERVER_PORT,
                        mode: process.env.LOG_SERVER_MODE
                    }
                },
            ],
        },
        nestedKey: "payload",
        mixin(_context, level, logger) {
            let finalData = {};
            // Add label to log data
            if (logger.hasOwnProperty("levels")) {
                let label = logger.levels.labels[level].toUpperCase();
                finalData.label = label; 
            }
            // Add header to log dataa
            if (_context.hasOwnProperty("req")) {
                let rawHeaders = _context.req.raw.rawHeaders;
                finalData.rawHeaders = rawHeaders;
            }
            return finalData;
        },
        redact: {
            paths: redactPaths,
            censor: "**PDPA-COMPLIANCE**"
        },
        level: process.env.PINO_LOG_LEVEL || "info",
    }

}


module.exports = pinoConfigs;