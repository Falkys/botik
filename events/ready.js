const config = require("../config.js");
const { version: discordjsVersion } = require("discord.js");
const discord = require('discord.js')
const chalk = require("chalk");

module.exports = {
  name: 'ready',
  code: async (client) => {
    client.user.setPresence({
        status: "idle"
    });

    function randomstatus() {

        let status = [
            `${config.prefix}help | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members 👥`,
            `${config.prefix}help | ${client.guilds.cache.size} Серверов 🌐`,
            `${config.prefix}help | falkysy лучший`
        ];

        let rstatus = Math.floor(Math.random() * status.length);
        
        client.user.setActivity(status[rstatus], {
            type: discord.ActivityType.Playing
        });

    };
    setInterval(randomstatus, 15000);
    
    client.logger.log(`> 🔍 • by falkysy`, "info"); // Удалите эту строку если хотите
    client.logger.log(`> ✅ • Успешно вошли как ${client.user.username}\n\n======================================`, "success");
console.log(
    chalk.white("Watching"),
    chalk.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
    chalk.white(
      `${
        client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
          ? "Users,"
          : "User,"
      }`
    ),
    chalk.red(`${client.guilds.cache.size}`),
    chalk.white(`${client.guilds.cache.size > 1 ? "Servers." : "Server."}`)
  );
  console.log(
    chalk.white(`Prefix:` + chalk.red(` ${config.prefix}`)),
    chalk.white("||"),
    chalk.red(`${client.commands.size}`),
    chalk.white(`Commands`)
  );
  console.log("");
  console.log(chalk.red.bold("——————————[Statistics]——————————"));
  console.log(
    chalk.gray(
      `Discord.js Version: ${discordjsVersion}\nRunning on Node ${process.version} on ${process.platform} ${process.arch}`
    )
  );
  console.log(
    chalk.gray(
      `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
        2
      )} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2
      )} MB`
    )
  );
      }
};