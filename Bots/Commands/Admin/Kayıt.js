const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    conf: {
        name: "Kayıt",
        aliases: ["kayıt"],
        description: "Bir sunucuya kayıt talebi açar.",
        usage: ".kayıt",
        category: "admin",
    },

    execute: async (client, message) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }


        const embed = new EmbedBuilder()
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle("📋 Kayıt Sistemi")
            .setDescription(`
👋 **Sunucumuza hoş geldiniz!**
📌 Kayıt olmak için aşağıdaki **Butona** tıklayın.

📜 **Kayıt Formu** açılacak ve sizden bazı bilgiler isteyecektir.
İnançlar: İslam, Hristiyan, Ateist, Musevi, Budist, Deist

🔍 **İnanç bilgisi** sunucuda doğru rollerin verilmesi için gereklidir.
🛡️ Bu sistem, topluluğumuzun düzenli ve güvenli kalmasını sağlar.
            `)
            .setColor("393A41");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("kayit_button")
                .setLabel("📨 Kayıt Ol")
                .setStyle(ButtonStyle.Primary)
        );

        message.channel.send({ embeds: [embed], components: [row] });
    },
};
