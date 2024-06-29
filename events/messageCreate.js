const discord = require("discord.js");
const config = require("../config.js");
const db = require("../db.js")
const vars = require("../vars.js");

module.exports = {
    name: "messageCreate",
    code: async (client, message) => {
 let value;
    try {
        const result = await db.get("settings", `prefix_${message.guild.id}`);
        console.log(result)
        value = result;
 } catch {
     value = vars.prefix
 }

      const prefix = value;
    
const prefixes = [prefix, 'cherryblood', 'cherry!', `<@${client.user.id}>`]; //  сюда все ваши префиксы
const messageContent = message.content.toLowerCase();

   let prefixesText = prefixes.map((p, index) => `Префикс ${index + 1}: ${p}`).join('\n');

let teag = new discord.EmbedBuilder()
    .setTitle(message.author.tag)
    .setColor(config.color)
    .setDescription(`📂 | Мои префиксы:\n${prefixesText}`);
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`)

    return message.channel.send({ embeds: [teag] })
    

let usedPrefix = prefixes.find(prefix => messageContent.startsWith(prefix));
if (!usedPrefix || message.author.bot || message.channel.type === 'dm') {
  return;
}
    // args
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const cmda = args.shift().toLowerCase();
    let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
    if (!command) return;

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new discord.Collection());
    }

    // Кулдаун
    let now = Date.now();
    let timeStamp = client.cooldowns.get(command.name) || new Collection();
    let cool = command.cooldown || 5;
    let userCool = timeStamp.get(message.author.id) || 0;
    let estimated = userCool + cool * 1000 - now;

    if (userCool && estimated > 0) {
        let cool = new discord.EmbedBuilder()
            .setDescription(`❌ Please wait ${( estimated / 1000 ).toFixed()}s more before reusing the ${command.name} command.`)
        return (await message.reply({ embeds: [cool] })
            .then(msg => { setTimeout(() => msg.delete().catch(() => null), estimated) })
        )
    }

    timeStamp.set(message.author.id, now);
    client.cooldowns.set(command.name, timeStamp);
    try {
        command.run(client, message, args)
    } catch (error) {
        client.logger.log(error, "error");
        message.reply({ content: `there was an error trying to execute that command!` });
    } finally {
        client.logger.log(`> ID : ${message.author.id} | User : ${message.author.tag} | command | ${command.name} | Guild : ${message.guild.id}`, "info");
    }
}
};
