const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    conf: {
        name: "Fiyat",
        aliases: ["Fiyat", "fiyat", "price"],
        description: "Sunucunun fiyatlarını gösterir.",
        usage: ".fiyat",
        category: "admin",
    },

    execute: async (client, message) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        const fiyatListesi = new EmbedBuilder()
            .setTitle("Fiyat Listesi")
            .setDescription(`
${client.emoji("instagram")} Instagram Takipçi Hizmetleri (**\`Ömür Boyu Garantili\`**)
─────────────────────────
\`+3.000 Takipçi        →\` 299₺
\`+4.000 Takipçi        →\` 399₺
\`+5.000 Takipçi        →\` 800₺
\`+10.000 Takipçi       →\` 1.675₺
─────────────────────────
${client.emoji("tiktok")} TikTok Takipçi Hizmetleri (Organik)
─────────────────────────
\`+3.000 Takipçi       →\` 375₺
\`+4.000 Takipçi       →\` 165₺
\`+5.000 Takipçi       →\` 200₺
\`+10.000 Takipçi      →\` 285₺
─────────────────────────
${client.emoji("discord")} Discord Üyeli Sunucular
─────────────────────────
\`+2.000 Üyeli Discord Sunucusu →\` 300₺
\`+3.000 Üyeli Discord Sunucusu →\` 290₺
\`+4.000 Üyeli Discord Sunucusu →\` 380₺
\`+5.000 Üyeli Discord Sunucusu →\` 500₺
─────────────────────────
${client.emoji("steam")} Steam Key Paketleri (WROX)
─────────────────────────
\`40$–200$ Arası Steam Key →\` 45₺
\`35$–150$ Arası Steam Key →\` 27₺
\`30$–125$ Arası Steam Key →\` 25₺
\`25$–100$ Arası Steam Key →\` 25₺
\`15$–80$ Arası Steam Key (VİP) →\` 23₺
─────────────────────────
`,
            )
            .setColor("393A41");


        const ts = new EmbedBuilder()
            .setTitle("Talep ve Hizmet Bilgi Sistemi")
            .setColor("393A41")
            .setDescription(`
<#${ayar.destekKanalID}> kanalında hizmetlerimiz hakkında bilgi alabilirsiniz.
                `)

        const sosyalMedyaEmbed = new EmbedBuilder().setTitle("SOSYAL MEDYA HESAPLARI").setDescription("Bizi sosyal medyada takip edin!").setColor("393A41");
        const sosyalMedyaButon1 = new ButtonBuilder().setLabel("Tiktok").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("tiktok")}`).setURL("https://twitter.com/");
        const sosyalMedyaButon2 = new ButtonBuilder().setLabel("Instagram").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("instagram")}`).setURL("https://instagram.com/");
        const row = new ActionRowBuilder().addComponents(sosyalMedyaButon1, sosyalMedyaButon2);

        await message.channel.send({
            embeds: [
                fiyatListesi,
                ts,
                sosyalMedyaEmbed,
            ],
            components: [row],
        });
    },
};
