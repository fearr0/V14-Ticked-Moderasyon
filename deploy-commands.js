const { REST, Routes } = require('discord.js');
const { clientId, ID } = require('./Global.Config');
const set = require('./Global/Config/Settings')
const fs = require('fs');
const path = require('path');
const commands = [];
const commandsPath = path.join(__dirname, './Bots/SlashCommand/');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(set.token);

(async () => {
    try {
        console.log(`🔄 Slash komutları yeniden yükleniyor...`);
        await rest.put(
            Routes.applicationGuildCommands(clientId, ID),
            { body: commands }
        );
        console.log(`✅ Komutlar başarıyla yüklendi.`);
    } catch (error) {
        console.error(error);
    }
})();