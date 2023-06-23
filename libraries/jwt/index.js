"use strict";

const jwt = require("jsonwebtoken");
const logger = require("../../app/utils/logger");
const config = require("config");

const JWT_SECRET = config.get("jwt.secret");

async function sign(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET);
  } catch (error) {
    throw error;
  }
}

async function decode(token) {
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.message && error.message === "invalid signature") logger.error(error);
    decoded = null;
  }

  return decoded;
}

module.exports.sign = sign;
module.exports.decode = decode;
