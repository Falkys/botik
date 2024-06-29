const discord = require('discord.js');
const config = require('../../config.js');
const { set, get } = require('../../Utils/funcs');
module.exports = {
    name: "prefix",
    aliases: [],
    description: "Set bot's change prefix",
    category: "Setup",
    cooldown: 5,
    run: async (client, message, args) => {

        if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        const embedmissingperms = new discord.EmbedBuilder()
            .setDescription(`⚠ | ${message.author.username}, Missing Permission **MANAGE_GUILD**!`)
            .setColor("#FF0000");

        const embedmissing = new discord.EmbedBuilder()
            .setDescription(`⚠ | Please type the prefix you want to set!`)
            .setColor("#FF0000");

        const embedtoolong = new discord.EmbedBuilder()
            .setDescription(`❌ | Prefix's length shouldn't be longer than 5 letters`)
            .setColor("#FF0000");

        const embedsame = new discord.EmbedBuilder()
            .setDescription(`⚠ Prefix is same to current's`)
            .setColor("#FF0000");

        if (!message.member.permissions.has("ManageGuild")) return message.channel.send({ embeds: [embedmissingperms] });

   

        if (!args[0]) return message.channel.send({ embeds: [embedmissing] });
        if (args[0].length > 5) return message.channel.send({ embeds: [embedtoolong] });
        if (args[0] == await get(message, "guild", "settings", "prefix"))
            return message.channel.send({ embeds: [embedsame] });

        if (args[0] === "reset") {
          set(message, "guild", "settings", "prefix", config.prefix)
            const embed = new discord.EmbedBuilder()
                .setDescription(`Prefix reset to Default : \`${config.prefix}\``)
                .setColor(config.color)
            return message.channel.send({ embeds: [embed] });
        }

        set(message, "guild", "settings", "prefix", args[0])
        const embed = new discord.EmbedBuilder()
        .setTitle("Prefix")
            .setDescription(`Префикс Changed to : \`${args[0]}\``)
            .setColor(config.color)
        message.channel.send({ embeds: [embed] });

    }
}
