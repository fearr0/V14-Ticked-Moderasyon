const { Events, ChannelType, EmbedBuilder } = require("discord.js");
const ayar = require("../../../Global.Config.js");

module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client) {

        client.on('messageDelete', async (message) => {
            if (!message.guild || message.author?.bot) return;

            const logChannel = client.kanal?.("message-delete-log") || client.channels.cache.get(ayar.messageLog);
            if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

            const unixTimestamp = Math.floor(Date.now() / 1000);

            const embed = new EmbedBuilder()
                .setColor("393A41")
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setDescription([
                    `🗑️ **Bir mesaj silindi!**`,
                    `👤 **Kullanıcı:** ${message.author} \`(${message.author.id})\``,
                    `📍 **Kanal:** <#${message.channel.id}>`,
                    `💬 **İçerik:** ${message.content || "*[Embed, dosya veya boş mesaj]*"}`,
                    `🕒 **Zaman:** <t:${unixTimestamp}:F>`,
                ].join("\n"))
            logChannel.send({ embeds: [embed] });
        });

        client.on('messageUpdate', async (oldMessage, newMessage) => {
            if (!oldMessage.guild || oldMessage.author?.bot) return;
            if (oldMessage.content === newMessage.content) return;

            const logChannel = client.kanal?.("message-delete-log") || client.channels.cache.get(ayar.messageDeleteLog);
            if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

            const unixTimestamp = Math.floor(Date.now() / 1000);

            const embed = new EmbedBuilder()
                .setColor("393A41")
                .setAuthor({ name: `${oldMessage.author.tag}`, iconURL: oldMessage.author.displayAvatarURL() })
                .setDescription([
                    `✏️ **Bir mesaj düzenlendi!**`,
                    `👤 **Kullanıcı:** ${oldMessage.author} \`(${oldMessage.author.id})\``,
                    `📍 **Kanal:** <#${oldMessage.channel.id}>`,
                    `🔹 **Önce:** ${oldMessage.content || "*[Boş veya embed]*"}`,
                    `🔸 **Sonra:** ${newMessage.content || "*[Boş veya embed]*"}`,
                    `🕒 **Zaman:** <t:${unixTimestamp}:F>`,
                ].join("\n"))
            logChannel.send({ embeds: [embed] });
        });

    }
};
