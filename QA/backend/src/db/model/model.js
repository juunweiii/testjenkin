"use strict"

const path = require("path");
const mongoose = require("mongoose");
// const { createDbInstance } = require(path.join(__dirname, "../config/mongo"));
const schema = require(path.join(__dirname, "../schema/schema"));

// Initialise DB
// const mon = createDbInstance();

const Users = mongoose.model("Users", schema.usersSchema);
const Topics = mongoose.model("Topics", schema.topicsSchema);
const SubTopics = mongoose.model("SubTopics", schema.subTopicsSchema);
const Threads = mongoose.model("Threads", schema.threadsSchema);

module.exports = {
    usersModel: Users,
    topicsModel: Topics,
    subTopicsModel: SubTopics,
    threadsModel: Threads,
}