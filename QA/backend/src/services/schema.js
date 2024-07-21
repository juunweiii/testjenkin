"use strict"

const path = require("path");
const { errorResSchema } = require(path.join(__dirname, "../utils/response"));

const authCheckSchema = {
    summary: "API to check if user is still authenticated",
    description: "Uses jwt, csrf_token and _csrf in cookie",
    tags: [""],
    security: [
        {
            jwt: [],
        },
        {
            csrf: [],
        },
        {
            csrfSecret: [],
        },
    ],
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                statusCode: { type: "number", examples: [200] },
                message: { type: "string", examples: ["Authentication pass."] },
                data: { 
                    type: "object",
                },
            }
        },
        400: errorResSchema[400],
        403: errorResSchema[403],
        500: errorResSchema[500],
        502: errorResSchema[502],
    }
}