"use strict"

module.exports = opts => require("pino-pretty")({
    ...opts,
    time: timestamp => `🕰 ${timestamp}`,
    level: logLevel => `LEVEL: ${logLevel}`,
    // messageFormat: (log, messageKey) => `hello ${log[messageKey]}`
});