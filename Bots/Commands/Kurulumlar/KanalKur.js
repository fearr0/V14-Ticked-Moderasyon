const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
    conf: {
        name: "kanal-kur",
        aliases: ["kanalkur"],
        description: "Sunucuda log kanalları için kategori ve kanalları oluşturur.",
        usage: ".kanal-kur",
        category: "Kurulum",
    },

    execute: async (client, message) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        const guild = message.guild;
        const categoryName = "Server-Logs";
        const logChannelNames = [
            "role-log",
            "ban-log",
            "jail-log",
            "muted-log",
            "message-delete-log"
        ];

        let logCategory = guild.channels.cache.find(
            c => c.name === categoryName && c.type === ChannelType.GuildCategory
        );

        if (!logCategory) {
            logCategory = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });
        }

        for (const name of logChannelNames) {
            const existing = guild.channels.cache.find(c => c.name === name);
            if (existing) continue;

            await guild.channels.create({
                name: name,
                type: ChannelType.GuildText,
                parent: logCategory.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });
        }

        return message.reply("✅ `Server-Logs` kategorisi ve log kanalları başarıyla kuruldu.");
    }
};
