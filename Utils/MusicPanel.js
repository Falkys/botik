const db = require("./funcs")
const discord = require('discord.js')
const config = require("../config.js")
const { emojibar } = require("emoji-progressbar");
const dp = require("discord-player")
function format(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    var minutes = Math.floor((milliseconds % 3600000) / 60000);
    var seconds = Math.floor((milliseconds % 60000) / 1000);

    var formattedString = "";

    if (hours >= 24) {
        var days = Math.floor(hours / 24);
        formattedString += days + ":";
        hours = hours % 24;
    }
    if (hours > 0) {
        formattedString += (hours < 10 ? "0" : "") + hours + ":";
    } else {
        formattedString += "00:";
    }

    formattedString += (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    return formattedString;
}

async function get(interaction, loopMode, isPaused, track) {
    try {
    const e_youtube = await db.get(interaction, "guild", "settings", "youtube");
    const e_soundcloud = await db.get(interaction, "guild", "settings", "soundcloud");
    const e_spotify = await db.get(interaction, "guild", "settings", "spotify");

    const e_play = await db.get(interaction, "guild", "settings", "play");
    const e_back = await db.get(interaction, "guild", "settings", "back");
    const e_next = await db.get(interaction, "guild", "settings", "next");
    const e_queue = await db.get(interaction, "guild", "settings", "queue");
    const e_loop0 = await db.get(interaction, "guild", "settings", "loop0");
    const e_loop1 = await db.get(interaction, "guild", "settings", "loop1");
    const e_loop2 = await db.get(interaction, "guild", "settings", "loop2");
    const e_loop3 = await db.get(interaction, "guild", "settings", "loop3");
    const e_seekf = await db.get(interaction, "guild", "settings", "seekf");
    const e_seekb = await db.get(interaction, "guild", "settings", "seekb");
    const e_volumem = await db.get(interaction, "guild", "settings", "volumem");
    const e_volumep = await db.get(interaction, "guild", "settings", "volumep");
    const e_stop = await db.get(interaction, "guild", "settings", "stop");
    const e_pause = await db.get(interaction, "guild", "settings", "pause");

    const e_fullStart = await db.get(interaction, "guild", "settings", "fullStart");
    const e_fullBar = await db.get(interaction, "guild", "settings", "fullBar");
    const e_fullEnd = await db.get(interaction, "guild", "settings", "fullEnd");
    const e_emptyBar = await db.get(interaction, "guild", "settings", "emptyBar");
    const e_emptyEnd = await db.get(interaction, "guild", "settings", "emptyEnd");
    const queue = dp.useQueue(interaction.guild.id);
    const progress = emojibar(e_fullStart, e_fullBar, e_fullEnd, e_fullStart, e_emptyBar, e_emptyEnd, queue.dispatcher.audioResource.playbackDuration, queue.dispatcher.audioResource.metadata.__metadata.duration, 10);
    const messages = new discord.EmbedBuilder()
        .setAuthor({ name: track.author })
        .setDescription(`${eval("e_" + track.raw.source)} [${track.title}](${track.url})
        ${isPaused ? e_play : e_pause} ${progress} ${format(queue ? queue.dispatcher.audioResource.playbackDuration : 46080)} / ${track.duration}`)
        .setThumbnail(track.thumbnail)
        .setColor(config.color)
    const buttonsl1 = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId('back')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_back),
            new discord.ButtonBuilder()
                .setCustomId('seekb')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_seekb),
            new discord.ButtonBuilder()
                .setCustomId('play')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(isPaused ? e_play : e_pause),
            new discord.ButtonBuilder()
                .setCustomId('seekf')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_seekf),
            new discord.ButtonBuilder()
                .setCustomId('next')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_next)
        )
    const buttonsl2 = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId('queue')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_queue),
            new discord.ButtonBuilder()
                .setCustomId('volumem')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_volumem),
            new discord.ButtonBuilder()
                .setCustomId('stop')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_stop),
            new discord.ButtonBuilder()
                .setCustomId('volumep')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji(e_volumep),
            new discord.ButtonBuilder()
                .setCustomId('loop')
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji((loopMode === 'track') ? e_loop2 : (loopMode === 'queue') ? e_loop1 : (loopMode === 'shuffle') ? e_loop3 : e_loop0)
        )


    const filters = new discord.ActionRowBuilder()
        .addComponents(
            new discord.StringSelectMenuBuilder({
                custom_id: 'songs',
                placeholder: 'Выберите фильтр',
                max_values: 1,
                options: [{
                    label: 's',
                    value: 's',
                    description: "s",
                }]
            },)
        )

    return {
        filters,
        buttonsl1,
        buttonsl2,
        messages
    }
} catch (e) {
    console.log(e)
    return "error"
}
}
module.exports = { get }