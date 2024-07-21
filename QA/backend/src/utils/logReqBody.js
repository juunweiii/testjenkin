"use strict"

module.exports = async function(req, reply) {
    if (req.body) {
        req.log.info({ body: req.body }, "parsed body data");
    }
}