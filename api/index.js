const { static, Router } = require("express");
const api = Router();
const fs = require("fs");
const { join } = require("path");


api.use("/", require("./routes"));

module.exports = api;
