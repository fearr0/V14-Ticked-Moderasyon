const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ayar = require('../../Global.Config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolver')
        .setDescription('Belirtilen kullanıcıya rol verir veya rolü varsa alır.')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Rol verilecek/alınacak kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Verilecek veya alınacak rol')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(ayar.YetkiliRoleID)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const member = interaction.options.getMember('kullanici');
        const role = interaction.options.getRole('rol');
        if (!member) return interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
        if (!role) return interaction.reply({ content: 'Rol bulunamadı.', ephemeral: true });

        if (interaction.member.roles.highest.position <= role.position) {
            return interaction.reply({ content: 'Kendi rolünden yüksek veya eşit bir rolü veremez veya alamazsın.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: 'Rol vermek/almak için botun yeterli yetkisi yok.', ephemeral: true });
        }
        if (interaction.guild.members.me.roles.highest.position <= role.position) {
            return interaction.reply({ content: 'Botun rolü, işlem yapılacak rolden yüksek olmalı.', ephemeral: true });
        }

        const logKanal = interaction.guild.channels.cache.get(ayar.roleLog) || interaction.guild.channels.cache.find(ch => ch.name === "role-log");

        try {
            let embed, işlemTipi;

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                işlemTipi = "Rol Alındı";
                embed = new EmbedBuilder()
                    .setColor('393A41')
                    .setTitle(işlemTipi)
                    .setDescription(`${member} kullanıcısından ${role} rolü başarıyla alındı.`)
                    .setTimestamp();
            } else {
                await member.roles.add(role);
                işlemTipi = "Rol Verildi";
                embed = new EmbedBuilder()
                    .setColor('393A41')
                    .setTitle(işlemTipi)
                    .setDescription(`${member} kullanıcısına ${role} rolü başarıyla verildi.`)
                    .setTimestamp();
            }

            if (logKanal) {
                const logEmbed = new EmbedBuilder()
                    .setColor('393A41')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(`SlashCommand: ${işlemTipi}`)
                    .addFields(
                        { name: 'Hedef Kullanıcı', value: `${member} (\`${member.id}\`)`, inline: true },
                        { name: 'Rol', value: `${role} (\`${role.id}\`)`, inline: true },
                        { name: 'İşlem Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                    )
                    .setTimestamp();

                await logKanal.send({ embeds: [logEmbed] }).catch(() => { });
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Rol verme/alma hatası:', error);
            interaction.reply({ content: 'Rol işlemi sırasında bir hata oluştu.', ephemeral: true });
        }
    },
};
