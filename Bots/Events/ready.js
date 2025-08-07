const { Events, ActivityType } = require("discord.js");
const ayar = require("../../Global.Config.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} başarıyla giriş yaptı!`);

        setInterval(() => {
            const randomStatus = Math.floor(Math.random() * ayar.BOT_STATUS.length);
            client.user.setPresence({
                activities: [
                    {
                        name: ayar.BOT_STATUS[randomStatus],
                        type: ActivityType.Watching,
                    },
                ],
                status: "dnd",
            });
        }, 10000);
    },
};
