"use strict"

require("@dotenvx/dotenvx").config();
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const nodemailerMg = nodemailer.createTransport(mg({
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    },
    host: process.env.MAILGUN_HOST,
}));

module.exports = { nodemailerMg }