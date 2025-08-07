const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    conf: {
        name: "Destek",
        aliases: ["destek"],
        description: "Bir sunucuya destek talebi açar.",
        usage: ".destek",
        category: "admin",
    },

    execute: async (client, message, args) => {
        
        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }


        const embed = new EmbedBuilder()
            .setColor("393A41")
            .setTitle("📩 Destek Talebi Oluştur")
            .setDescription("Aşağıdaki menüden almak istediğiniz destek türünü seçerek bir destek talebi oluşturabilirsiniz.\nHer talep, size özel bir kanalda açılır.")
            .setFooter({ text: `${message.guild.name} • Destek Sistemi`, iconURL: message.guild.iconURL() });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("destek_paneli")
            .setPlaceholder("🎯 Destek kategorisi seçin")
            .addOptions([
                { label: "Genel Destek", description: "Genel konularda yardım alın.", value: "genel_destek", emoji: "💬", },
                { label: "Teknik Sorun", description: "Bot, sistem, sunucu sorunları için.", value: "teknik_destek", emoji: "🛠️", },
                { label: "Şikayet Bildirimi", description: "Kullanıcı veya sistemle ilgili şikayet.", value: "sikayet_destek", emoji: "🚨", },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);
        message.channel.send({ embeds: [embed], components: [row] });
    },
};
