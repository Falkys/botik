const db = require('./../db.js'); 
const variable = require("./../vars.js");

async function get(message, type, table, key, user, guild) {
    try {
    if (type === "user") {
        let result;
         result = await db.get(table, `${key}_${guild ? guild : message.guild.id}_${user ? user : message.author.id}`);
        if (!result) {
            return variable[key];
    } else {
        return result;
    }
    } else if (type === "guild") {
        const result = await db.get(table, `${key}_${guild ? guild : message.guild.id}`);
        if (!result) {
            return variable[key];
        } else {
            return result;
        }
    }
} catch (err) {
    console.log(err)
}
}

async function set(message, type, table, key, value, user, guild) {
    try {
    if (type === "user") {
        const result = await db.set(table, `${key}_${guild ? guild : message.guild.id}_${user ? user : message.author.id}`, value);
        if (!result) {
            return variable[key];
    } else {
        return result;
    }
    } else if (type === "guild") {
        const result = await db.set(table, `${key}_${guild ? guild : message.guild.id}`, value);
        if (!result) {
            return variable[key];
        } else {
            return result;
        }
    }
} catch (err) {
    console.log(err)
}
}

module.exports = { get, set };
