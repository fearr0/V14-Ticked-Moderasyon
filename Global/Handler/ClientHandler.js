const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 100;
const { Client, GatewayIntentBits, Collection, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { cacheMessage } = require("../../messageCache.js");
const fs = require('fs');
const path = require('path');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});


global.client = client;
client.commands = new Collection();
client.aliases = new Collection();
const commandsPath = path.resolve(__dirname, "../../Bots/Commands");

fs.readdir(commandsPath, (err, folders) => {
    if (err) {
        console.error(`[Hata] Komut klasörleri okunamadı: ${err.message}`);
        return;
    }

    folders.forEach((folder) => {
        const folderPath = path.join(commandsPath, folder);
        fs.readdir(folderPath, (err2, files) => {
            if (err2) {
                console.error(`[Hata] ${folder} klasörü okunamadı: ${err2.message}`);
                return;
            }
            files
                .filter((file) => file.endsWith(".js"))
                .forEach((file) => {
                    const commandPath = path.join(folderPath, file);

                    try {
                        const command = require(commandPath);

                        if (command.conf && command.conf.name) {
                            client.commands.set(command.conf.name, command);
                            console.log(`[✔] Yüklenen Komut: ${command.conf.name}`);

                            if (Array.isArray(command.conf.aliases)) {
                                command.conf.aliases.forEach((alias) => {
                                    client.aliases.set(alias, command.conf.name);
                                });
                            }
                        } else {
                            console.warn(`[Uyarı] ${file} dosyasında geçerli bir komut bulunamadı.`);
                        }
                    } catch (error) {
                        console.error(`[Hata] ${file} dosyası yüklenemedi: ${error.message}`);
                    }
                });
        });
    });
});

const eventsPath = path.join(__dirname, '../../Bots/Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

const JsPath = path.join(__dirname, '../../Bots/Events/Js');
const JsFiles = fs.readdirSync(JsPath).filter(file => file.endsWith('.js'));

for (const file of JsFiles) {
    const event = require(path.join(JsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.on("messageCreate", (message) => {
    cacheMessage(message);
});

client.on('rateLimit', (info) => {
    console.warn(`Rate Limit Uyarısı: ${JSON.stringify(info)}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});


client.emoji = function (name) {
    for (const guild of client.guilds.cache.values()) {
        const emoji = guild.emojis.cache.find(e => e.name === name);
        if (emoji) return emoji.toString();
    }
    return null;
};

client.kanal = function (query) {
    const guild = client.guilds.cache.first();
    if (!guild) return null;
    return guild.channels.cache.find(
        kanal => kanal.name === query || kanal.id === query
    );
};


module.exports = client;
