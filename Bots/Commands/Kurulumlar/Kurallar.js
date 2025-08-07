const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
module.exports = {
    conf: {
        name: "Kurallar",
        aliases: ["kurallar", "rules"],
        description: "Sunucunun kurallarını gösterir ve sosyal medya linkleri butonlarını içerir.",
        usage: ".kurallar",
        category: "admin",
    },

    execute: async (client, message) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        const kurallarEmbed = new EmbedBuilder()
            .setTitle("SUNUCU KURALLARI")
            .setDescription(`
${client.emoji("nokta")} Saygılı olun.
${client.emoji("nokta")} Spam yapmak yasaktır.
${client.emoji("nokta")} Reklam yapmak yasaktır.
${client.emoji("nokta")} Küfür ve hakaret yasaktır.
${client.emoji("nokta")} Yetkililere karşı gelmek yasaktır.
`,
            )
            .setColor("393A41");

        const sosyalMedyaEmbed = new EmbedBuilder()
            .setTitle("SOSYAL MEDYA HESAPLARI")
            .setDescription("Bizi sosyal medyada takip edin!")
            .setColor("393A41");

        const sosyalMedyaButon1 = new ButtonBuilder().setLabel("Tiktok").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("tiktok")}`).setURL("https://twitter.com/")
        const sosyalMedyaButon2 = new ButtonBuilder().setLabel("Instagram").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("instagram")}`).setURL("https://instagram.com/")
        const row = new ActionRowBuilder().addComponents(sosyalMedyaButon1, sosyalMedyaButon2);

        await message.channel.send({
            embeds: [kurallarEmbed, sosyalMedyaEmbed],
            components: [row],
        });
    },
};
