const config = require('../../config.js');
const child = require("child_process");
const axios = require("axios");

module.exports = {

    name: "test",
    aliases: ["sx", "$s"],
    description: "exec / run terminal in discord!",
    category: "Owner",
    cooldown: 3,
    run: async (client, message, args) => {

        if (message.author.id !== config.ownerID) return message.channel.send('Can\'t execute this command!');

        console.log(client)
    }
}
