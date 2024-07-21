"use strict"

const path = require("path");
const fp = require("fastify-plugin");
const { newEnforcer, casbinJsGetPermissionForUser } = require("casbin");
const { MongooseAdapter } = require("casbin-mongoose-adapter");
const policy = require(path.join(__dirname, "policy"));
// const { MongoChangeStreamWatcher } = require("@casbin/mongo-changestream-watcher");

// Reference from: https://github.com/nearform/fastify-casbin/blob/master/plugin.js
// Watcher requires 2 open ports on database and replica set mode
module.exports = fp(async function(fastify, opts) {
    const model = path.join(__dirname, "model.conf");
    const adapter = await MongooseAdapter.newAdapter(process.env.DB_AUTH_URL);
    const enforcer = await newEnforcer(model, adapter);

    await enforcer.loadPolicy();

    // Refer to https://casbin.org/docs/frontend/#advanced-usage
    enforcer.casbinJsGetPermissionForUser = user =>
        casbinJsGetPermissionForUser(enforcer, user);

    fastify.decorate("casbin", enforcer);
    fastify.addHook("onRequest", async function(req, reply) {
      req.reqUtils.casbin = enforcer;
    });
    
    fastify.addHook("onReady", async function() {
      for (const rule of await policy.getAdminPolicy()) {
        if (!await enforcer.hasNamedPolicy("p", ...rule)) await enforcer.addNamedPolicy("p", ...rule);
      }
      for (const rule of await policy.getUserPolicy()) {
        if (!await enforcer.hasNamedPolicy("p", ...rule)) await enforcer.addNamedPolicy("p", ...rule);
      }
      for (const rule of await policy.getModeratorPolicy()) {
        if (!await enforcer.hasNamedPolicy("p", ...rule)) await enforcer.addNamedPolicy("p", ...rule);
      }
    });
});