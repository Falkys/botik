const discord = require("discord.js");
const config = require("../../config")
module.exports = {
    name: "interactionCreate",
    code: async (client, interaction) => {
        if (interaction.isCommand()) {
            if (interaction.commandName === "ping") {
                await interaction.reply({ content: `Ping`, ephemeral: true });

            }
        }
    }
};
