"use strict"

const boom = require("@hapi/boom");

// use for standard reply, custom reply need to code at specific api endpoint
const res = async function(reply, statusCode, message = null, data) {
    return reply
                .code(statusCode)
                .send({
                    statusCode: statusCode,
                    message: message || "Successful request",
                    data: data || {},
                })
}

const errorRes = async function (reply, statusCode = 0, message = null , error = null) {
    if (error) {
        reply.log.error(error);
    }
    let errorData = null;
    switch(statusCode) {
        case 400: // client request error
            errorData = boom.badRequest("Bad query");
            if (message) errorData.message = message;
            return reply
                        .code(400)
                        .send(errorData)
        case 401: // client need to be authenticated
            errorData = boom.unauthorized("Unauthenicated access", "Please re-authenticate");
            if (message) errorData.message = message;
            return reply
                        .code(401)
                        .send(errorData)
        case 403: // client identity known but inappropriate rights
            errorData = boom.unauthorized("Unauthorized access to resource");
            if (message) errorData.message = message;
            return reply
                        .code(403)
                        .send(errorData)
        case 404: // request does not exists
            errorData = boom.notFound("Missing")
            if (message) errorData.message = message;
            return reply
                        .code(404)
                        .send(errorData)
        case 405: // unsupported API method
            errorData = boom.methodNotAllowed("Supplied method not allowed");
            if (message) errorData.message = message;
            return reply
                        .code(405)
                        .send(errorData)
        case 422: // use this for duplication entry into database
            errorData = boom.badData("Request not performed due to semantic errors");
            if (message) errorData.message = message;
            return reply
                        .code(422)
                        .send(errorData)
        case 502: // APIs' handler got bad response
            errorData = boom.badGateway("Something went wrong with API handler");
            if (message) errorData.message = message;
            return reply
                        .code(502)
                        .send(errorData)
        case 503: // All APIs are down since base URL unreachable
            errorData = boom.serverUnavailable("APIs currently unavailable");
            if (message) errorData.message = message;
            return reply
                        .code(503)
                        .send(errorData)
        case 504: // circuit breaker and timeout errors
            errorData = boom.gatewayTimeout("Request Timeout");
            if (message) errorData.message = message;
            return reply
                        .code(504)
                        .send(errorData)
        default: // everything else throw here
            errorData = boom.badImplementation("An internal server error occurred");
            if (message) errorData.message = message;
            return reply
                        .code(500)
                        .send(errorData)
    }
}

const errorResSchema = {   
    400: {
        type: "object",
        description: "Client request got errors",
        properties: {
            statusCode: { type: "number", examples: [400] },
            error: { type: "string", examples: ["Bad Request"] },
            message: { type: "string", examples: ["Bad query"] },
        }
    },
   401: {
        type: "object",
        description: "Client need to be authenticated",
        properties: {
            statusCode: { type: "number", examples: [401] },
            error: { type: "string", examples: ["Unauthorized"] },
            message: { type: "string", examples: ["Please re-authenticate"] },
        }
   },
   403: {
        type: "object",
        description: "Client identity known but inappropriate rights",
        properties: {
            statusCode: { type: "number", examples: [403] },
            error: { type: "string", examples: ["Forbidden"] },
            message: { type: "string", examples: ["Unauthorized access to resource"] },
        }
    },
   404: {
        type: "object",
        description: "Request does not exists",
        properties: {
            statusCode: { type: "number", examples: [404] },
            error: { type: "string", examples: ["Not Found"] },
            message: { type: "string", examples: ["Missing"] },
        }
    },
   405: {
        type: "object",
        description: "Unsupported API method",
        properties: {
            statusCode: { type: "number", examples: [405] },
            error: { type: "string", examples: ["Method not allowed"] },
            message: { type: "string", examples: ["Supplied method not allowedBad query"] },
        }
    },
   422: {
        type: "object",
        description: "Duplication entry into database",
        properties: {
            statusCode: { type: "number", examples: [422] },
            error: { type: "string", examples: ["Unprocessable Entity"] },
            message: { type: "string", examples: ["Request not performed due to semantic errors"] },
        }
    },
   502: {
        type: "object",
        description: "APIs' handler got bad response",
        properties: {
            statusCode: { type: "number", examples: [502] },
            error: { type: "string", examples: ["Bad Gateway"] },
            message: { type: "string", examples: ["Something went wrong with API handler"] },
        }
    },
   503: {
        type: "object",
        description: "All APIs are down since base URL unreachable",
        properties: {
            statusCode: { type: "number", examples: [503] },
            error: { type: "string", examples: ["Service Unavailable"] },
            message: { type: "string", examples: ["APIs currently unavailablead query"] },
        }
    },
   504: {
        type: "object",
        description: "circuit breaker and timeout errors",
        properties: {
            statusCode: { type: "number", examples: [504] },
            error: { type: "string", examples: ["Gateway Time-out"] },
            message: { type: "string", examples: ["Request Timeout" ] },
        }
    },
   500: {
        type: "object",
        description: "Any other unknown errors",
        properties: {
            statusCode: { type: "number", examples: [500] },
            error: { type: "string", examples: ["Internal Server Error"] },
            message: { type: "string", examples: ["An internal server error occurred"] },
        }
    },
}

module.exports = { res, errorRes, errorResSchema }