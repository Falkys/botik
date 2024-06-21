const discord = require("discord.js");
const { readdirSync } = require('fs');
const db = require("../../Utils/funcs.js");
const config = require("../../config.js")
const panels = require("../../Utils/MusicPanel.js");
const { updateProgress, playProgress } = require("../../Utils/ProgressBar.js")
const dp = require("discord-player")
module.exports = {
    name: "interactionCreate",
    code: async (client, interaction) => {
        if (interaction.isStringSelectMenu()) { // Заменили метод на isStringSelectMenu()
            if (interaction.customId === "songs") {
                try {
                    const categories = readdirSync(`./commands/`);
                    const value = await interaction.values[0].split("_");
                    const tracks = await client.songs;
                    const channel = interaction.member.voice.channel;
                    const index = parseInt(value[0]);
                    const results = client.songs.first();
                    const query = value[1];
                    const type = value[0];
                    await interaction.deferUpdate();
                    const wait = new discord.EmbedBuilder()
                        .setDescription(`Поиск...`)
                        .setColor(config.color)
                        .setFooter({
                            text: `Requested by ${interaction.user.username} | Today at  `, iconURL: interaction.user.displayAvatarURL({
                                forceStatic: true
                            })
                        })
                    await interaction.editReply({ embeds: [wait], components: [], content: '' });
                    const { track } = await client.player.play(channel, results[index], {
                        requestedBy: interaction.user,

                    })
                    const e_youtube = await db.get(interaction, "guild", "settings", "youtube");
                    const e_soundcloud = await db.get(interaction, "guild", "settings", "soundcloud");
                    const e_spotify = await db.get(interaction, "guild", "settings", "spotify");
                    const queue = dp.useQueue(interaction.guild.id);

                    const panel = await panels.get(interaction, "none", true, track)
                    if (panel === "error") {
                        return interaction.editReply({
                            embeds: new discord.EmbedBuilder()
                                .setAuthor({ name: "Ошибка" })
                                .setDescription(`Неизвестная ошибка, попробуйте еще раз`)
                                .setColor(config.color)
                        });
                    } else {
                    playProgress(interaction, queue.dispatcher.audioResource.metadata.__metadata.duration, 15, track)
                    return interaction.editReply({
                        embeds: [panel.messages],
                        components: [panel.buttonsl1, panel.buttonsl2, panel.filters]
                    });
                }

                } catch (err) {
                    console.log(err)

                }
            }
        }
    }
};
