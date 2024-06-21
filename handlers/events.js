const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const eventFiles = getAllEventFiles("./events/").map(file => path.resolve(__dirname, `../${file}`));

    for (const file of eventFiles) {
        try {
            const Event = require(file);
            client.events.set(Event.name, Event.code)
            client.on(Event.name, (...args) => Event.code(client, ...args));
            client.logger.log(`> ➕ • ${path.basename(file)} загружено`, "event"); 
        } catch (err) {
            client.logger.log("Error While loading", "warn")
            client.logger.log(err, "error");
        }
    }
    client.logger.log(`> ✅ • Загружено успешно [EVENT]`, "success");
};

function getAllEventFiles(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        if (isDirectory) {
            getAllEventFiles(filePath, fileList);
        } else if (file.endsWith(".js")) {
            fileList.push(path.relative(path.join(__dirname, '../../events'), filePath));
        }
    }

    return fileList;
}
