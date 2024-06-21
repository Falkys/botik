const discord = require('discord.js');
const config = require('../../config.js');
const db = require('../../Utils/funcs.js');
module.exports = {
    name: "remove-money",
    aliases: ['removemoney', 'removem', "rm"],
    description: "Set Money Balance",
    category: "Economy",
    cooldown: 5,
    run: async (client, message, args) => {
        const error = new discord.EmbedBuilder()
        .setTitle("Ой Ой")
        .setFields({ 
            name: "Использование",
            value: `\`${await db.get(message, "guild", "settings", "prefix")}remove-money <money | bank> <Кол-во> [@User | User-id]\`
             - <> - обьязательно \n- [] - необьязательно \n- <gg | wp> - выберите один вариант` })
        .setColor(await db.get(message, "guild", "settings", "error"))
        try {
        

if (!args[1]) return message.channel.send({ 
    embeds: [error.setDescription(`${await db.get(message, "guild", "settings", "no")} | Вы указали не все аргументы`)] 
});
if (args[0] !== "money" && args[0] !== "bank") return message.channel.send({ 
    embeds: [error.setDescription(`${await db.get(message, "guild", "settings", "no")} | Нужно указать \`bank\` или \`money\` `)] 
});
if (isNaN(parseInt(args[1]))) return message.channel.send({ 
    embeds: [error.setDescription(`${await db.get(message, "guild", "settings", "no")} | Кол-во не число`)] 
});

let username;
let avatar;
let mentioned;
        if (message.mentions.users.first()) {
         mentioned = message.mentions.users.first().id
         username = message.mentions.users.first().username;
         avatar = message.mentions.users.first().avatarURL();
        } else {
            if (message.guild.members.cache.get(`${args[2]}`)) {
                mentioned = args[2]
                let user = message.guild.members.cache.get(`${args[2]}`).user
                username = user.username;
                avatar = user.avatarURL();
            } else {
                mentioned = message.author.id;
                username = message.author.username;
                avatar = message.author.avatarURL();
            }
        }
        const money = await db.get(message, "user", "economy", "money", mentioned);
       const bank = await db.get(message, "user", "economy", "bank", mentioned);
        if (args[0] === 'money') {
                db.set(message, "user", "economy", "money", parseInt(args[1]) - parseInt(money), mentioned)
        } else if (args[0] === 'bank') {
            db.set(message, "user", "economy", "bank", parseInt(args[1]) - parseInt(bank), mentioned)
        }
        const currency = await db.get(message, "user", "settings", "currency");
        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: `${username}`, iconURL: avatar })
            .setDescription(`
Убавлено ${args[1]} | ${currency} пользователю <@${mentioned}>`)
            .setColor(config.color)
        message.channel.send({ embeds: [embed] });
    } catch (err) {
        console.log(err)
         message.channel.send({ embeds: [error] });
    }
    }
}

