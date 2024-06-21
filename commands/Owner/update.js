const fs = require("fs");
const discord = require("discord.js");
const path = require("path");
const eventsMessage = [];

function getFiles(dir) {
  let files = fs.readdirSync(path.join(process.cwd(), dir));
  let fileList = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fileList = fileList.concat(getFiles(filePath));
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function removeEvents(client, dir) {
  const eventFiles = getAllEventFiles("./events/").map(file => path.resolve(__dirname, `../../events/${file}`));

  for (let file of eventFiles) {
    delete require.cache[file];
    const Event = require(file)
    const eventName = path.basename(file, ".js"); // Получаем имя события из имени файла
    client.removeAllListeners();
    if (Event.name) {
      client.events.delete(Event.name, Event.code);
    } else {
      console.warn(`${file} - ❌  -> отсутствует Event.name.`);
      continue;
    }
  }
}

function getAllEventFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
  
      const filePath = path.join(dirPath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory) {
          getAllEventFiles(filePath, fileList);
      } else if (file.endsWith(".js")) {
          fileList.push(path.relative(path.join(__dirname, '../../events'), filePath));
      }
  }

  return fileList;
}

module.exports = {
  name: "update",
  aliases: ["up"],
  cooldown: 1,
  description: "Обновить команды",
  category: "Owner",

  run: async (client, message, args) => {
    try {
      let folders = fs.readdirSync("./commands/");
      let commandsSend = ""; 
      
      folders.forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        const commandsMessage = [];
        for (const file of commandFiles) {
          delete require.cache[require.resolve(`../../commands/${dir}/${file}`)];
          const command = require(`../../commands/${dir}/${file}`);
          if (command.name) {
            client.commands.delete(command.name, command);
          } else {
            console.warn(`${file} - ❌  -> отсутствует help.name или help.name не является строкой.`);
            continue;
          }
        }
        
        for (const file of commandFiles) {
          const command = require(`../../commands/${dir}/${file}`);
          if (command.name) {
            client.commands.set(command.name, command);
            client.logger.log(`> 📂 • ${command.name} | ${command.category} перезагруженны.`, "cmd-reload");
            commandsMessage.push(`> 📂 • ${command.name} | ${command.category} перезагруженны.`);
          } else {
            client.logger.log(`${file} - ❌  -> отсутствует help.name или help.name не является строкой.`, "warn");
            continue;
          }
        }
        commandsSend += commandsMessage.join('\n'); 
      });
        
      client.logger.log(`> ✅ • Команды успешно обновлены.`, "reload");


      removeEvents(client, "./events/")
      
      const eventFiles = getAllEventFiles("./events/").map(file => path.resolve(__dirname, `../../events/${file}`));

    for (const file of eventFiles) {
        try {
          const Event = require(file);
            client.events.set(Event.name, Event.code)
            client.on(Event.name, (...args) => Event.code(client, ...args));
            client.logger.log(`> ➕ • ${path.basename(file)} загружено`, "event"); 
            eventsMessage.push(`> ➕ • ${path.basename(file)} загружено`); 
        } catch (err) {
            client.logger.log("Error While loading", "warn")
            client.logger.log(err, "error");
        }
    }
    client.logger.log(`> ✅ • Загружено успешно [EVENT]`, "success");


      const messageToSend = eventsMessage.join('\n');
      const embed = new discord.EmbedBuilder()
        .setTitle('Успешно')
        .setDescription(`Все команды обновлены 
            Commands:
            ${commandsSend}
            Events:
            ${messageToSend}`)
        .setColor('EA435F')
      message.channel.send({embeds: [embed]});
    } catch (error) {
      client.logger.log("Error While loading", "warn");
      client.logger.log(error, "error");
    }
  },
}; 
