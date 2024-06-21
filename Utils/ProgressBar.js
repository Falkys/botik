const panels = require("./MusicPanel.js");
const progressData = {};

async function updateProgressBar(serverId) {
    const data = progressData[serverId];
    if (data) {
        console.log(`Прогресс на сервере ${serverId}: ${data.progress.toFixed(2)}% : ${data.progress}`);
        const panel = await panels.get(data.message, "none", true, data.track);
        data.message.editReply({
            embeds: [panel.messages],
            components: [panel.buttonsl1, panel.buttonsl2, panel.filters]
        });
    }
}

function updateProgress(serverId) {
    const data = progressData[serverId];
    if (data && !data.isPaused) {
        if (data.progress >= data.trackDuration) {
            data.progress = 0;
            clearInterval(data.progressInterval);
            console.log(`Трек на сервере ${serverId} завершен.`);
        } else {
            data.progress += data.trackDuration / data.progressBarUpdates;
            updateProgressBar(serverId);
        }
    }
}

function pauseProgress(serverId) {
    const data = progressData[serverId];
    if (data) {
        clearInterval(data.progressInterval);
        data.isPaused = true;
        console.log(`Прогресс на сервере ${serverId} приостановлен.`);
    }
}

function resumeProgress(serverId) {
    const data = progressData[serverId];
    if (data) {
        data.isPaused = false;
        data.progressInterval = setInterval(() => updateProgress(serverId), data.intervalDuration);
        console.log(`Прогресс на сервере ${serverId} возобновлен.`);
    }
}

function stopProgress(serverId) {
    const data = progressData[serverId];
    if (data) {
        data.progress = 0;
        clearInterval(data.progressInterval);
        console.log(`Трек на сервере ${serverId} завершен.`);
    }
}

function playProgress(messages, trackDurations, progressBarUpdate, tracks) {
    progressData[messages.guild.id] = {
        progress: 0,
        isPaused: false,
        intervalDuration: trackDurations / progressBarUpdate,
        trackDuration: trackDurations,
        progressBarUpdates: progressBarUpdate,
        message: messages,
        track: tracks
    };
    progressData[messages.guild.id].progressInterval = setInterval(() => updateProgress(messages.guild.id), progressData[messages.guild.id].intervalDuration);
}

module.exports = {
    playProgress,
    pauseProgress,
    resumeProgress,
    stopProgress
};
