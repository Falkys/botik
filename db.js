const { CreateStorage } = require("database-sempai");

const db = new CreateStorage({
  path: "database",
  table: ["economy", "settings"],
  extname: ".json",
});
module.exports = db;