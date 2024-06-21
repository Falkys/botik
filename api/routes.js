const express = require("express")
const api = express.Router();
const { Collection } = require("discord.js");
const { join } = require("path");
const fs = require("fs");

api.use(express.json());

module.exports = api;
