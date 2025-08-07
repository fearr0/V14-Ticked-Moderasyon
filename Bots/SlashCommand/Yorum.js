const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ayar = require('../../Global.Config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yorum')
        .setDescription('Bir hizmet için yıldızlı yorum bırak')
        .addIntegerOption(option =>
            option.setName('puan')
                .setDescription('Hizmet puanını seç (1-5)')
                .setRequired(true)
                .addChoices(
                    { name: '⭐ 1', value: 1 },
                    { name: '⭐⭐ 2', value: 2 },
                    { name: '⭐⭐⭐ 3', value: 3 },
                    { name: '⭐⭐⭐⭐ 4', value: 4 },
                    { name: '⭐⭐⭐⭐⭐ 5', value: 5 }
                )
        )
        .addStringOption(option =>
            option.setName('yorum')
                .setDescription('Yorumunuzu yazın')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const puan = interaction.options.getInteger('puan');
        const yorum = interaction.options.getString('yorum');
        const user = interaction.user;

        const doluYildiz = '⭐'.repeat(puan);
        const bosYildiz = '☆'.repeat(5 - puan);
        const yildizlar = doluYildiz + bosYildiz;

        const embed = new EmbedBuilder()
            .setTitle('📝 Yeni Müşteri Yorumu')
            .addFields(
                { name: 'Kullanıcı', value: `${user.tag}`, inline: true },
                { name: 'Puan', value: `${yildizlar} (${puan}/5)`, inline: true },
                { name: 'Yorum', value: yorum }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(puan >= 4 ? 'Green' : puan === 3 ? 'Yellow' : 'Red')
            .setFooter({ text: `Yorum Tarihi: ${new Date().toLocaleDateString('tr-TR')}` });

        const yorumKanalı = interaction.guild.channels.cache.get(ayar.yorumKanalID);

        if (!yorumKanalı) {
            return interaction.editReply({ content: 'Yorum kanalı bulunamadı! ❌' });
        }

        try {
            await yorumKanalı.send({ embeds: [embed] });
            await interaction.editReply({ content: 'Yorumunuz başarıyla gönderildi! ✅' });
        } catch (error) {
            console.error('Yorum gönderilirken hata:', error);
            await interaction.editReply({ content: 'Yorum gönderilirken bir hata oluştu! ❌' });
        }
    }
};
