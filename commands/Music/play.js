const discord = require('discord.js');
const config = require('../../config.js');
const timezone = require("moment-timezone");
const { SlashCommandBuilder } = require('discord.js');
const { QueryType, useMainPlayer, GuildQueue, GuildQueueHistory } = require('discord-player');
const fs = require("fs")
module.exports = {

    name: "play",
    aliases: [],
    description: "Get bot's real time ping status",
    category: "Other",
    cooldown: 5,
    run: async (client, message, args) => {
        const db = await client.db;
        if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send({
            content: "Поключитесь к голосовому каналу"
        });
        const e_youtube = await db.get(message, "guild", "settings", "youtube");
        const e_soundcloud = await db.get(message, "guild", "settings", "soundcloud");
        const e_spotify = await db.get(message, "guild", "settings", "spotify");
        const query = args.join(' ');
        const results = await client.player.search("youtube:" + query, {
            requestBy: message.author
        })
        if (!results.hasTracks()) return message.channel.send({
            content: "Треки не найдены"
        });
        const tracks = await results.tracks.slice(0, 24)
        client.songs.clear()
        await client.songs.set("songss", tracks)
        const embed = new discord.EmbedBuilder()
            .addFields({ name: 'Song', value: `title`, inline: true })
            .setColor(config.color)
            .setFooter({
                text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({
                    forceStatic: true
                })
            })
        try {

            const s = {
                title: "s",
                author: "d",
                url: 'https://localhost'
            };
            const messages = new discord.EmbedBuilder()
                .setAuthor({ name: s.author })
                .setTitle("PLaying " + s.title)
                .setThumbnail(s.url)
                .setDescription(`s`)
                .setColor(config.color)
                .setFooter({
                    text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({
                        forceStatic: true
                    })
                })

            const songs_option = await tracks.map((s, d) => {
                const labels = {
                    label: s.title.substring(0, 100),
                    value: d.toString(),
                    description: s.author.substring(0, 100),
                    emoji: e_youtube,
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
                            { label: 'Youtube', value: 'youtube_' + query, emoji: e_youtube, description: "Youtube search", default: true },
                            { label: 'SoundCloud', value: 'soundcloud_' + query, emoji: e_soundcloud, description: "SoundCloud search" },
                            { label: 'Spotify', value: 'spotify_' + query, emoji: e_spotify, description: "Spotify search" },
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

            return message.channel.send({
                embeds: [messages], components: [engines, songs]
            });

        } catch (e) {
            console.log(e)
            return message.channel.send({ embeds: [embed.setDescription("Ошибка")] })
        }
    }
};
