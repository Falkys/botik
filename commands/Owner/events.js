const fs = require("fs");
const discord = require("discord.js");

function removeEvents(client) {
  const eventFiles = fs.readdirSync(`./events/`).filter((file) => file.endsWith(".js"));

  for (let file of eventFiles) {
    const eventName = file.split(".")[0];
    client.removeAllListeners();
  }
}

module.exports = {
  name: "udate",
  aliases: ["p"],
  description: "Обновить команды",
  category: "Owner",

  run: async (client, message, args) => {
    removeEvents(client);

    const eventFiles = getAllEventFiles("./events/").map(file => path.resolve(__dirname, `../../events/${file}`));

    for (let file of eventFiles) {
      try {
        delete require.cache[require.resolve(`../../events/${file}`)]; // Очищаем кеш, чтобы загрузить новую версию файла
        const Event = require(file);
        Event.event = Event.event || file.replace(".js", "");
        client.on(Event.name, (...args) => Event.code(client, ...args));
        client.logger.log(`> ➕ • ${file} загружено`, "event");
      } catch (err) {
        client.logger.log("Error While loading", "warn");
        client.logger.log(err, "error");
      }
    }
    client.logger.log(`> ✅ • Загружено успешно [EVENT]`, "success");
  },
};