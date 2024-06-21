const discord = require("discord.js");
const { Player } = require('discord-player');
const config = require("./config.js");
const db = require("./db.js");
const fs = require("fs");
const path = require("path");
const Express = require("express");
const app = Express();
const http = require('http').Server(app);
const port = 4000;
app.use("/", require("./api"));
const dbs = require("./Utils/funcs.js")
const client = new discord.Client({
    closeTimeout: 3_000 ,
    waitGuildTimeout: 15_000,
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildVoiceStates,
        discord.GatewayIntentBits.GuildPresences,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMessageTyping,
        discord.GatewayIntentBits.MessageContent
    ],
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    makeCache: discord.Options.cacheWithLimits({
		...discord.Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
        GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: member => member.id === client.user.id,
		}
	}),
});


client.player = new Player(client);
client.db = dbs;

async function s() {
await client.player.extractors.loadDefault();
}
s()

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldowns = new discord.Collection();
client.events = new discord.Collection();
client.songs = new discord.Collection();
client.logger = require('./Utils/logger');
["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


db.on("ready", () => { 
    console.log("Database is ready!"); 
}); 

db.connect();
client.login(config.token).catch(() => { client.logger.log('Invaid TOKEN!', "warn") });


