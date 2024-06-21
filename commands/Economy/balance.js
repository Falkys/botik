const discord = require('discord.js');
const config = require('../../config.js');
const db = require('../../Utils/funcs.js');
module.exports = {
    name: "balance",
    aliases: ['bal','money'],
    description: "Money Balance",
    category: "Economy",
    cooldown: 5,
    run: async (client, message, args) => {
              if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });
        let id;
        let username;
        let avatar;
        if (message.mentions.users.first()) {
            id = message.mentions.users.first().id;
            username = message.mentions.users.first().username;
            avatar = message.mentions.users.first().avatarURL();
           } else {
               if (message.guild.members.cache.get(`${args[0]}`)) {
                   id = args[0]
                   let user = message.guild.members.cache.get(`${args[0]}`).user
                   username = user.username;
                   avatar = user.avatarURL();
               } else {
                   id = message.author.id;
                   username = message.author.username;
                   avatar = message.author.avatarURL();
           }
        }
        const money = await db.get(message, "user", "economy", "money", id);
        const currency = await db.get(message, "guild", "economy", "currency");
       const bank = await db.get(message, "user", "economy", "bank", id);
        const embed = new discord.EmbedBuilder()
        .setAuthor({ name: `${username}`, iconURL: avatar })
        .setFields(
            { name: "Money", value: `${currency} | ${money}`, inline: true},
            { name: "Bank", value: `${currency} | ${bank}`, inline: true},
            { name: "Total", value: `${currency} | ${parseInt(money) + parseInt(bank)}`, inline: true}
        )
            .setColor(config.color)
        message.channel.send({ embeds: [embed] });
    }
}


