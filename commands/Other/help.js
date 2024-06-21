const discord = require('discord.js')
const config = require('../../config.js');
const db = require('../../Utils/funcs');
const timezone = require("moment-timezone");
const { readdirSync } = require('fs');

module.exports = {
    name: "help",
    aliases: ["h", "cmd"],
    description: "Get's all Commmands, or one specific command",
    category: "Other",
    cooldown: 5,
    run: async (client, message, args) => {

        if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        if (!args[0]) {

            const categories = readdirSync(`./commands/`)

            const emo = {
                Other: "<:other:1098394789222826014> • ",
                Setup: "<:setup:1098376290962247771> • ",
                Economy: "<:currency:1100455594344853575> • ",
            };
    
            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: `❯ ・ Commands list - ${client.commands.size} Commands`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))
                .setColor(config.color)
                .setTimestamp()
            .setDescription(`~~————————————————~~
                **..:📌INFO📌:..**
[Supports Server](https://discord.gg/ffgdc3g7Mj) | [Site](https://cherryblood.repl.co)
**Префикс**: \`${await db.get(message, "guild", "settings", "prefix")}\`
~~————————————————~~`)
                .setFooter({ text: `Requested by ${message.author.username} |`, iconURL: message.author.displayAvatarURL({ 
                        forceStatic: true 
                    }) 
                })
    
            for (const category of categories) {
                         if (category !== "Owner") {
                const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ", "\n");
       
                embed.addFields({ name: `${emo[category]} ${(category)} Commands`, value: `> ${commands}`, inline: false });
          }      
            }
    const menu = new discord.ActionRowBuilder()
    .addComponents(
    new discord.StringSelectMenuBuilder({
	custom_id: 'helpmenu',
	placeholder: 'Выберите опцию',
	max_values: 1,
	options: [
		{ label: 'Economy', value: '1', emoji: "<:currency:1100455594344853575>", description: "Все команды с экономикой" },
		{ label: 'Setup', value: '2', emoji: "<:setup:1098376290962247771>", description: "Все комманды настройки"},
		{ label: 'Other', value: '3', emoji: "<:other:1098394789222826014>", description: "Другие комманды" },
	],
}) 
        )
            return message.channel.send({
                embeds: [embed], components: [menu]
            });


        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

            if (!command) {
                const embed = new discord.EmbedBuilder()
                        .setDescription(`Invalid command! Use \`${config.prefix}help\` for all of my commands!`)
                        .setColor(config.color)
                return message.channel.send({
                        embeds: [embed]
                });
            }

            const embed = new discord.EmbedBuilder()
                .setTitle("Command Details:")
                .setThumbnail('https://hzmi.xyz/assets/images/question_mark.png')
                .addFields({ name: "Command:", value: command.name ? `\`${command.name}\`` : "No name for this command.", inline: true })
                .addFields({ name: "Usage:", value: command.usage ? `\`${command.usage}\`` : `\`${config.prefix}${command.name}\``, inline: true })
                .addFields({ name: 'Aliases', value: `\`${command.aliases.length ? command.aliases.join(" | ") : "none."}\``, inline: true })
                .addFields({ name: "Command Description:", value: command.description ? command.description : "No description for this command.", inline: true })
                .setFooter({ text: `Requested by ${message.author.username} |`, iconURL: message.author.displayAvatarURL({
                        forceStatic: true
                    })
                })
                .setTimestamp()
                .setColor(config.color);
            return message.channel.send({
                    embeds: [embed]
            });
        }

    }
};
