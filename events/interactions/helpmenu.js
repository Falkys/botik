const discord = require("discord.js");
const { readdirSync } = require('fs');
const db = require("../../Utils/funcs.js");

module.exports = {
    name: "interactionCreate",
    code: async (client, interaction, message) => {
        if (interaction.isStringSelectMenu()) { // Заменили метод на isStringSelectMenu()
            if (interaction.customId === "helpmenu") {
            const categories = readdirSync(`./commands/`);
            const selectedValue = interaction.values[0];
            let embed;
            if (selectedValue === '1') {
                embed = new discord.EmbedBuilder()
                    .setColor("#EA435F");
                for (const category of categories) {
                    if (category === "Economy") {
                        const prefix = await db.get(interaction, "guild", "settings", "prefix");
                        embed.setTitle(category);
                        const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => embed.addFields({ name: `${prefix}${cmd.name}`, value: `> ${cmd.description}`, inline: false }));
                    }
                }
            } else if (selectedValue === '2') {
                embed = new discord.EmbedBuilder()
                    .setColor("#EA435F");
                for (const category of categories) {
                    if (category === "Setup") {
                        const prefix = await db.get(interaction, "guild", "settings", "prefix");
                        embed.setTitle(category);
                        const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => embed.addFields({ name: `${prefix}${cmd.name}`, value: `> ${cmd.description}`, inline: false }));
                    }
                }
            } else if (selectedValue === '3') {
                embed = new discord.EmbedBuilder()
                    .setColor("#EA435F");
                for (const category of categories) {
                    if (category === "Other") {
                        const prefix = await db.get(interaction, "guild", "settings", "prefix");
                        embed.setTitle(category);
                        const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => embed.addFields({ name: `${prefix}${cmd.name}`, value: `> ${cmd.description}`, inline: false }));
                    }
                }
            }

            await interaction.reply({ embeds: [embed], content: `Вы выбрали: ${selectedValue}`, ephemeral: true });
        };
    }
    }
};
