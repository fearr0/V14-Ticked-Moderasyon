const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ComponentType } = require("discord.js");
const Penalty = require("../../../Models/penalty");
const PenaltyCounter = require("../../../Models/penaltyCounter");
const SavedRoles = require("../../../Models/savedRoles");
const ayar = require("../../../Global.Config");

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
        name: "Jail",
        aliases: ["cezalı", "jail"],
        description: "Kullanıcıyı süreli jaile atar.",
        usage: ".jail @kullanıcı",
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
            .setCustomId("jail_menu")
            .setPlaceholder("Bir ceza sebebi ve süresi seçin")
            .addOptions([
                { emoji: `${client.emoji("ban")}`, label: "Reklam - 7 gün", value: "reklam_7d", description: "Sunucuda reklam yapmak" },
                { emoji: `${client.emoji("ban")}`, label: "Küfür - 1 gün", value: "kufur_1d", description: "Küfür veya hakaret" },
                { emoji: `${client.emoji("ban")}`, label: "Troll / Rahatsız Edici Davranış - 6 saat", value: "troll_6h" },
                { emoji: `${client.emoji("ban")}`, label: "Diğer - Elle Gir", value: "diger", description: "Elle sebep ve süre gir" },
            ]);

        const row = new ActionRowBuilder().addComponents(select);

        const msg = await message.reply({
            embeds: [new EmbedBuilder()
                .setTitle("🚨 Jail Sebebi Seçimi")
                .setDescription(`${member} kişisini neden jaile atmak istiyorsunuz?`)
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
                    .setCustomId(`jail_modal_${member.id}`)
                    .setTitle("Jail Sebebi ve Süresi");

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

            await applyJail(client, message, member, type, sureMs, i);
        });

        // Modal submit olayını sadece bu komut içinden dinlemek için:
        const filter = (interaction) => interaction.isModalSubmit() && interaction.customId === `jail_modal_${member.id}` && interaction.user.id === message.author.id;
        const modalCollector = message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        modalCollector.on("collect", async (interaction) => {
            const sebep = interaction.fields.getTextInputValue("sebep");
            const sureStr = interaction.fields.getTextInputValue("sure");
            const sureMs = parseDuration(sureStr);

            if (!sureMs) return interaction.reply({ content: "❌ Süre biçimi geçersiz. Örn: 1d, 6h, 10m, 30s veya sadece 1 (saat)", ephemeral: true });

            await applyJail(client, message, member, sebep, sureMs, interaction);
        });
    },
};

async function applyJail(client, message, member, reason, durationMs, interaction) {
    // Önce kayıtlı rolleri MongoDB'ye kaydet
    const jailRoleId = ayar.jailRole;
    const jailRole = message.guild.roles.cache.get(jailRoleId);
    if (!jailRole) return interaction.reply({ content: "❌ Jail rolü ayarlanmamış.", ephemeral: true });

    // Kullanıcının rolleri (jail rolü hariç) al
    const rolesToSave = member.roles.cache.filter(r => r.id !== jailRoleId).map(r => r.id);

    // Kaydet
    await SavedRoles.findOneAndUpdate(
        { userID: member.id },
        { roles: rolesToSave, date: Date.now() },
        { upsert: true }
    );

    // Ceza numarası
    const penaltyData = await PenaltyCounter.findOneAndUpdate(
        { id: "penalty" },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
    );

    // Roller jail rolü olarak değiştirilir
    await member.roles.set([jailRole], "Jail cezası uygulandı.");

    // Ceza kaydı
    const bitisTarihi = Date.now() + durationMs;
    await new Penalty({
        userID: member.id,
        userName: member.user.tag,
        staffID: message.author.id,
        staffName: message.author.tag,
        reason: reason,
        type: "JAIL",
        penaltyNo: penaltyData.count,
        date: Date.now(),
        finishDate: bitisTarihi
    }).save();

    const logChannel = client.kanal("jail-log") || message.guild.channels.cache.get(ayar.JAİL_LOG);
    const embed = new EmbedBuilder()
        .setTitle("🚫 Jail Cezası")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("393A41")
        .setDescription(`
**❯ Kullanıcı:** ${member} (\`${member.id}\`)
**❯ Yetkili:** ${message.author} (\`${message.author.id}\`)
**❯ Sebep:** \`${reason}\`
**❯ Bitiş:** <t:${Math.floor(bitisTarihi / 1000)}:R> (\`${formatDuration(durationMs)}\`)
**❯ Ceza No:** \`#${penaltyData.count}\`
        `);

    await interaction.reply({ content: `✅ ${member} adlı kullanıcı jaile atıldı.`, ephemeral: true });
    if (logChannel) logChannel.send({ embeds: [embed] });

    setTimeout(async () => {
        const user = await message.guild.members.fetch(member.id).catch(() => null);
        if (!user) return;

        if (user.roles.cache.has(jailRoleId)) {
            try {
                const saved = await SavedRoles.findOne({ userID: member.id });
                if (saved && saved.roles.length) {
                    await user.roles.set(saved.roles, "Jail süresi doldu, roller geri yüklendi.");
                    await SavedRoles.deleteOne({ userID: member.id });
                } else {
                    await user.roles.remove(jailRoleId, "Jail süresi doldu ama önceki roller bulunamadı.");
                }
            } catch (e) {
                console.error("Roller geri yüklenirken hata:", e);
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
