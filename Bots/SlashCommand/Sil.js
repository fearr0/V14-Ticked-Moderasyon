const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const ayar = require("../../Global.Config.js");
const messageCache = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sil")
        .setDescription("Belirtilen sayıda mesajı siler.")
        .addIntegerOption(option =>
            option
                .setName("adet")
                .setDescription("Silinecek mesaj sayısı (1-100)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    cacheMessages(client) {
        client.on("messageCreate", (message) => {
            if (message.author.bot) return;
            if (!message.guild) return;

            messageCache.set(message.id, {
                content: message.content,
                authorTag: message.author.tag,
                createdAt: message.createdAt
            });

            setTimeout(() => messageCache.delete(message.id), 5 * 60 * 1000);
        });
    },

    async execute(interaction) {
        const adet = interaction.options.getInteger("adet");
        const kanal = interaction.channel;
        const logKanal = interaction.guild.channels.cache.get(ayar.messageLog);
        if (!logKanal) {
            return interaction.reply({ content: "❌ Log kanalı bulunamadı!", ephemeral: true });
        }

        try {
            const rawDeleted = await kanal.bulkDelete(adet, true);
            const silinenMesajlar = rawDeleted.filter(msg => !msg.author.bot);

            if (silinenMesajlar.size === 0) {
                return interaction.reply({
                    content: "❌ Silinecek kullanıcı mesajı bulunamadı.",
                    ephemeral: true
                });
            }

            let detaylar = "";
            silinenMesajlar.forEach(msg => {
                const cached = messageCache.get(msg.id);
                const icerik = (cached?.content ?? msg.content).slice(0, 100);
                const timestamp = Math.floor((cached?.createdAt ?? new Date(msg.createdTimestamp)).getTime() / 1000);
                const zamanDamgasi = `<t:${timestamp}:R>`;

                const authorTag = cached?.authorTag ?? msg.author.tag;
                detaylar += `• **${authorTag}** (${zamanDamgasi}): ${icerik.length < msg.content.length ? icerik + "..." : icerik}\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle("Mesaj Silme Logu")
                .setColor("393A41")
                .setDescription(detaylar)
                .setFooter({ text: `Silinen Kullanıcı Mesajı: ${silinenMesajlar.size}` })
                .setTimestamp();

            await logKanal.send({ embeds: [embed] });
            await interaction.reply({
                content: `✅ Başarıyla ${silinenMesajlar.size} kullanıcı mesajı silindi ve loglandı.`,
                ephemeral: true
            });
        } catch (error) {
            console.error("Mesaj silme hatası:", error);
            await interaction.reply({
                content: "❌ Mesajlar silinirken bir hata oluştu. Lütfen tekrar deneyin.",
                ephemeral: true
            });
        }
    }
};
