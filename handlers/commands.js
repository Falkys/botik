const fs = require("fs");
const path = require("path");
const discord = require("discord.js")

module.exports = (client) => {

    let folders = fs.readdirSync("./commands/");
    
    folders.forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                client.logger.log(`> ➕ • ${command.name} | ${command.category} | загружено`, "cmd")
            } else {
                client.logger.log(`${file} - ❌  -> missing a help.name, or help.name is not a string.`, "warn");
                continue;
            }
            client.commands.set(command.name, command);
        }
    });
    client.logger.log(`> ✅ • Загруженно Успешно [COMMAND]`, "success");

};
