const discord = require("discord.js");
const { readdirSync } = require('fs');
const db = require("../../Utils/funcs.js");
const config = require("../../config.js")
module.exports = {
    name: "interactionCreate",
    code: async (client, interaction, message) => {
        if (interaction.isStringSelectMenu()) { // Заменили метод на isStringSelectMenu()
            if (interaction.customId === "searchPanel") {
                try {
                    const categories = readdirSync(`./commands/`);
                    const value = await interaction.values[0].split("_");
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
                    const results = await client.player.search(type + ":" + query, {
                        requestBy: interaction.user
                    })

                    if (!results.hasTracks()) return interaction.editReply({
                        contents: "Треки не найдены"
                    });
                    const e_youtube = await db.get(interaction, "guild", "settings", "youtube");
                    const e_soundcloud = await db.get(interaction, "guild", "settings", "soundcloud");
                    const e_spotify = await db.get(interaction, "guild", "settings", "spotify");

                    const messages = new discord.EmbedBuilder()
                        .setTitle("Нашли ")
                        .setDescription(`Удалось найти ${results.tracks.length} треков`)
                        .setColor(config.color)
                        .setFooter({
                            text: `Requested by ${interaction.user.username} | Today at  `, iconURL: interaction.user.displayAvatarURL({
                                forceStatic: true
                            })
                        })
                    const tracks = await results.tracks.slice(0, 24)
                    client.songs.clear()
                    await client.songs.set("songss", tracks)
                    const songs_option = await tracks.map((s, d) => {
                        const labels = {
                            label: s.title.substring(0, 100),
                            value: d.toString(),
                            description: s.author.substring(0, 100),
                            emoji: eval("e_" + type),
                        };

                        return labels;

                    });
                    const engines = new discord.ActionRowBuilder()
                        .addComponents(
                            new discord.StringSelectMenuBuilder({
                                custom_id: 'searchPanel',
                                placeholder: 'Выберите платформу',
                                max_values: 1,
                                options: [
                                    { label: 'Youtube', value: 'youtube_' + query, emoji: e_youtube, description: "Youtube search", default: type === "youtube" },
                                    { label: 'SoundCloud', value: 'soundcloud_' + query, emoji: e_soundcloud, description: "SoundCloud search", default: type === "soundcloud" },
                                    { label: 'Spotify', value: 'spotify_' + query, emoji: e_spotify, description: "Spotify search", default: type === "spotify" },
                                ],
                            },)
                        )

                    const songs = new discord.ActionRowBuilder()
                        .addComponents(
                            new discord.StringSelectMenuBuilder({
                                custom_id: 'songs',
                                placeholder: 'Выберите трек',
                                max_values: 1,
                                options: songs_option
                            },)
                        )

                    return interaction.editReply({
                        embeds: [messages],
                        components: [engines, songs]
                    });
                } catch (err) {
                    console.log(err)
                    interaction.editReply({ content: "ошибка" })
                }
            }
        }
    }
};
