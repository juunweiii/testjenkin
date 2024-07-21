const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const mongoose = require("mongoose");

const ajv = new Ajv({
    // Fastify defaults
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    strict: true,
    strictTypes: true,
    strictRequired: false,
    allowUnionTypes: true,


    // Custom additions
    keywords: [
        {
            keyword: "x-examples",
        },
    ],
});

addFormats(ajv);

ajv.addVocabulary([
    // OpenAPI root elements
    "components",
    "externalDocs",
    "info",
    "openapi",
    "paths",
    "security",
    "servers",
    "schemas",
    // OpenAPI Request/Response (relative) root element
    "content",
]);

ajv.addFormat("objectId", {
    type: "string",
    validate: (data) => {
        console.log(data)
        return mongoose.Types.ObjectId.isValid(data);
    }
})

module.exports = { ajv }