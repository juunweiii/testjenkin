"use strict"

const mongoose = require("mongoose");
require("@dotenvx/dotenvx").config()

// Return mongoose instance 
const createDbInstance = async function() {
    let mon;
    mon = await mongoose.connect(process.env.DB_AUTH_URL);
    return mon;
}

module.exports = { createDbInstance }