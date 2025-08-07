const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const TalepLimit = require("../../../Models/talepLimit.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu()) return;
            if (interaction.customId !== "destek_paneli") return;
            await interaction.deferReply({ ephemeral: true });
            const destekKategoriID = ayar.destekKategori || "1373717594611388446";
            const destekTurleri = { genel_destek: "Genel Destek", teknik_destek: "Teknik Sorun", sikayet_destek: "Şikayet Bildirimi" };
            const secilenTur = interaction.values[0];
            const destekTuru = destekTurleri[secilenTur] || "Bilinmeyen";
            const now = new Date();

            let talepData = await TalepLimit.findOne({ userId: interaction.user.id });
            if (talepData && talepData.count >= 5) {
                const diffMs = now - talepData.lastRequestTime;
                const kalanMs = 24 * 60 * 60 * 1000 - diffMs;

                if (kalanMs > 0) {
                    const kalanSaat = Math.floor(kalanMs / (1000 * 60 * 60));
                    const kalanDakika = Math.floor((kalanMs % (1000 * 60 * 60)) / (1000 * 60));

                    return interaction.editReply({
                        content: `${client.emoji("no")} Günlük destek talebi limitinize ulaştınız.\n📌 Yeni talepler açmak için **${kalanSaat} saat ${kalanDakika} dakika** beklemeniz gerekiyor.`,
                        ephemeral: true
                    });
                } else {
                    talepData.count = 0;
                }
            }

            if (!talepData) {
                talepData = await TalepLimit.create({
                    userId: interaction.user.id,
                    count: 1,
                    lastRequestTime: now
                });
            } else {
                talepData.count += 1;
                talepData.lastRequestTime = now;
                await talepData.save();
            }

            const kalanHak = 5 - talepData.count;
            const existingSupportChannels = interaction.guild.channels.cache.filter(c => c.parentId === destekKategoriID && c.name.startsWith("destek-"));
            const ticketNumber = existingSupportChannels.size + 1;

            const channel = await interaction.guild.channels.create({
                name: `destek-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: destekKategoriID,
                permissionOverwrites: [{ id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel], }, { id: ayar.YetkiliRoleID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ReadMessageHistory,], }, { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ReadMessageHistory,], },],
            });

            const closeButton = new ButtonBuilder()
                .setCustomId("talep_kapat")
                .setLabel("Sorun çözüldü, kapat")
                .setStyle(ButtonStyle.Danger)
                .setEmoji(`${client.emoji("yes")}`);
            const row = new ActionRowBuilder().addComponents(closeButton);
            const embed = new EmbedBuilder()
                .setTitle("📩 Yeni Destek Talebi Oluşturuldu")
                .setColor("393A41")
                .setDescription(`**Destek Talebini Açan:** <@${interaction.user.id}> (\`${interaction.user.id}\`)
                **Destek Türü:** \`${destekTuru}\`
                **Talep Numarası:** \`#${ticketNumber}\`
                **Kalan Günlük Talep Hakkı:** \`${kalanHak} / 5\`
                **Oluşturulma Tarihi:** <t:${Math.floor(Date.now() / 1000)}:f>`)
                .addFields(
                    {
                        name: "📝 Açıklama",
                        value: `Yetkili ekibimiz en kısa sürede sizinle ilgilenecektir. Lütfen burada detaylı şekilde sorununuzu belirtin.`,
                    },
                    {
                        name: "📌 Kurallar",
                        value: `> ❗ Gereksiz talep oluşturmak yasaktır.
                > 📁 Gerekli dosyaları ve ekran görüntülerini bu kanala yükleyebilirsiniz.
                > ⛔ Destek tamamlandığında yalnızca **yetkililer** kapatma işlemini gerçekleştirebilir.`,
                    }
                )
                .setFooter({ text: `${interaction.guild.name} • Destek Sistemi`, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            await channel.send({ content: `<@${interaction.user.id}>, <@&${ayar.YetkiliRoleID}>`, embeds: [embed], components: [row] });
            interaction.editReply({ content: `${client.emoji("yes")} Destek talebiniz başarıyla oluşturuldu: ${channel}`, ephemeral: true });

            client.on("interactionCreate", async (interaction) => {
                if (!interaction.isButton()) return;
                if (interaction.customId !== "talep_kapat") return;
                if (!interaction.member.roles.cache.has(ayar.YetkiliRoleID)) { return interaction.reply({ content: `${client.emoji("no")} Bu talebi sadece yetkililer kapatabilir.`, ephemeral: true }); }
                await interaction.reply({ content: "📌 Talep birkaç saniye içinde kapatılacak...", ephemeral: true });
                setTimeout(() => { interaction.channel.delete().catch(console.error); }, 3000);
            });

        });
    }
};
