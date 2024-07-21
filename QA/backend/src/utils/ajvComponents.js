"use strict"

// Custom components to be used for schemas

const ajvErrorFormat = {
    $id: "error",
    Response: {
        type: "object",
        properties: {
            statusCode: { type: "number" },
            error: { type: "string" },
            message: { type: "string" },
        }
    }
}

const ajvReplyFormat = {
    $id: "reply",
    Response: {
        type: "object",
        properties: {
            statusCode: { type: "number" },
            message: { type: "string" },
            data: {
                type: "object",
                // properties: {},
            },
        },
    }
}

module.exports = [ ajvErrorFormat, ajvReplyFormat ];