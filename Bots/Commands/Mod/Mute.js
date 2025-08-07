const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ComponentType } = require("discord.js");
const Penalty = require("../../../Models/Penalty");
const PenaltyCounter = require("../../../Models/PenaltyCounter");
const ayar = require("../../../Global.Config");

// savedRoles Map'i kaldırıldı

function parseDuration(input) {
    const time = input.toLowerCase().trim();
    const unit = time.slice(-1);
    const amount = parseInt(time.slice(0, -1)) || parseInt(time);

    if (isNaN(amount)) return null;

    switch (unit) {
        case 's': return amount * 1000;
        case 'm': return amount * 60 * 1000;
        case 'h': return amount * 60 * 60 * 1000;
        case 'd': return amount * 24 * 60 * 60 * 1000;
        default:
            if (!isNaN(parseInt(time))) return parseInt(time) * 60 * 60 * 1000;
            return null;
    }
}

module.exports = {
    conf: {
        name: "Mute",
        aliases: ["sustur", "muted", "mute", "cmute"],
        description: "Kullanıcıyı süreli muteler.",
        usage: ".mute @kullanıcı",
        category: "Moderasyon",
    },

    execute: async (client, message, args) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        let member;
        if (message.mentions.members.first()) {
            member = message.mentions.members.first();
        } else if (args[0]) {
            try {
                member = await message.guild.members.fetch(args[0]);
            } catch (err) {
                member = undefined;
            }
        }
        if (!member) return message.reply("❌ Lütfen geçerli bir kullanıcı belirt.");

        if (member.id === message.author.id) return message.reply(`${client.emoji("no")} Kendine işlem uygulayamazsın.`);
        if (member.roles.highest.position >= message.member.roles.highest.position)
            return message.reply(`${client.emoji("no")} Bu kullanıcıya işlem yapamazsın.`);

        const select = new StringSelectMenuBuilder()
            .setCustomId("mute_menu")
            .setPlaceholder("Bir ceza sebebi ve süresi seçin")
            .addOptions([
                { emoji: `${client.emoji("ban")}`, label: "Spam - 30 dakika", value: "spam_30m", description: "Sunucuda spam yapmak" },
                { emoji: `${client.emoji("ban")}`, label: "Küfür - 1 saat", value: "kufur_1h", description: "Küfür veya hakaret" },
                { emoji: `${client.emoji("ban")}`, label: "Rahatsız Edici Davranış - 15 dakika", value: "rahatsiz_15m" },
                { emoji: `${client.emoji("ban")}`, label: "Diğer - Elle Gir", value: "diger", description: "Elle sebep ve süre gir" },
            ]);

        const row = new ActionRowBuilder().addComponents(select);

        const msg = await message.reply({
            embeds: [new EmbedBuilder()
                .setTitle("🔇 Mute Sebebi Seçimi")
                .setDescription(`${member} kişisini neden mutelemek istiyorsunuz?`)
                .setColor("393A41")
            ],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 30000,
            max: 1
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id)
                return i.reply({ content: `${client.emoji("no")} Bu menü sana ait değil.`, ephemeral: true });

            if (i.values[0] === "diger") {
                const modal = new ModalBuilder()
                    .setCustomId(`mute_modal_${member.id}`)
                    .setTitle("Mute Sebebi ve Süresi");

                const sebepInput = new TextInputBuilder()
                    .setCustomId("sebep")
                    .setLabel("Ceza Sebebi")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const sureInput = new TextInputBuilder()
                    .setCustomId("sure")
                    .setLabel("Ceza Süresi: 1s, 1m, 1h, 1d")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(sebepInput),
                    new ActionRowBuilder().addComponents(sureInput)
                );

                await i.showModal(modal);
                return;
            }

            const [type, sureStr] = i.values[0].split("_");
            const sureMs = parseDuration(sureStr);
            if (!sureMs) return i.reply({ content: "❌ Süre biçimi geçersiz.", ephemeral: true });

            await applyMute(client, message, member, type, sureMs, i);
        });

        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (!interaction.customId.startsWith("mute_modal_")) return;

            const sebep = interaction.fields.getTextInputValue("sebep");
            const sureStr = interaction.fields.getTextInputValue("sure");
            const sureMs = parseDuration(sureStr);

            if (!sureMs) return interaction.reply({ content: "❌ Süre biçimi geçersiz. Örn: 1d, 6h, 10m, 30s veya sadece 1 (saat)", ephemeral: true });

            const memberId = interaction.customId.split("_")[2];
            const target = message.guild.members.cache.get(memberId);
            if (!target) return interaction.reply({ content: "❌ Kullanıcı bulunamadı.", ephemeral: true });

            await applyMute(client, message, target, sebep, sureMs, interaction);
        });
    },
};

async function applyMute(client, message, member, reason, durationMs, interaction) {
    const muteRole = message.guild.roles.cache.get(ayar.muteRole);
    if (!muteRole) return interaction.reply({ content: "Mute rolü bulunamadı.", ephemeral: true });

    // Sadece mute rolü veriliyor
    await member.roles.add(muteRole, "Mute cezası uygulandı.");

    // Ceza numarası
    const penaltyData = await PenaltyCounter.findOneAndUpdate(
        { id: "penalty" },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
    );

    const logChannel = client.kanal("muted-log") || message.guild.channels.cache.get(ayar.MUTED_LOG);
    const bitisTarihi = Date.now() + durationMs;

    // Ceza kaydı oluşturulur
    await new Penalty({
        userID: member.id,
        userName: member.user.tag,
        staffID: message.author.id,
        staffName: message.author.tag,
        reason: reason,
        type: "MUTE",
        penaltyNo: penaltyData.count,
        date: Date.now(),
        finishDate: bitisTarihi
    }).save();

    // Log mesajı gönderilir
    const embed = new EmbedBuilder()
        .setTitle("🔇 Mute Cezası")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("393A41")
        .setDescription(`
**❯ Kullanıcı:** ${member} (\`${member.id}\`)
**❯ Yetkili:** ${message.author} (\`${message.author.id}\`)
**❯ Sebep:** \`${reason}\`
**❯ Bitiş:** <t:${Math.floor(bitisTarihi / 1000)}:R> (\`${formatDuration(durationMs)}\`)
**❯ Ceza No:** \`#${penaltyData.count}\`
        `);

    await interaction.reply({ content: `✅ ${member} adlı kullanıcı mute cezası aldı.`, ephemeral: true });
    if (logChannel) logChannel.send({ embeds: [embed] });

    // Süre bitince mute rolü kaldırılır
    setTimeout(async () => {
        const user = await message.guild.members.fetch(member.id).catch(() => null);
        if (!user) return;

        if (user.roles.cache.has(muteRole.id)) {
            try {
                await user.roles.remove(muteRole.id, "Mute süresi doldu.");
            } catch (e) {
                console.error("Mute rolü kaldırılırken hata:", e);
            }
        }
    }, durationMs);
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} saniye`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dakika`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat`;
    const days = Math.floor(hours / 24);
    return `${days} gün`;
}
