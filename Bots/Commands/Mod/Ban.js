const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const Penalty = require('../../../Models/penalty');
const PenaltyCounter = require('../../../Models/penaltyCounter.js');
const ayar = require('../../../Global.Config.js');

module.exports = {
    conf: {
        name: "ban",
        aliases: ["yasakla", "ban"],
        description: "Etiketlenen kullanıcıyı kalıcı olarak yasaklar.",
        usage: ".ban @kullanıcı",
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
        if (!member) return message.reply(`${client.emoji("no")} Lütfen bir kullanıcı etiketleyin veya ID girin.`);
        if (member.id === message.author.id) return message.reply(`${client.emoji("no")} Kendini banlayamazsın.`);
        if (!member.bannable) return message.reply(`${client.emoji("no")} Bu kullanıcıyı banlayamıyorum.`);

        const reasons = [
            { emoji: `${client.emoji("ban")}`, label: "Reklam", value: "Reklam yapmak" },
            { emoji: `${client.emoji("ban")}`, label: "Küfür", value: "Küfürlü konuşmak" },
            { emoji: `${client.emoji("ban")}`, label: "Troll", value: "Troll davranışlar" },
            { emoji: `${client.emoji("ban")}`, label: "Yetkiliye hakaret", value: "Yetkiliye hakaret" },
            { emoji: `${client.emoji("ban")}`, label: "Diğer", value: "OTHER" }
        ];

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`ban-reason-${member.id}`)
            .setPlaceholder(`🔨 Ban sebebini seçin`)
            .addOptions(reasons.map(r => ({ label: r.label, value: r.value, emoji: r.emoji })));

        const row = new ActionRowBuilder().addComponents(menu);

        const embed = new EmbedBuilder()
            .setTitle("🔨 Ban Sebebi Seçimi")
            .setDescription(`${member} kişisini neden banlamak istiyorsunuz?`)
            .setColor("393A41");

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async i => {
            if (i.user.id !== message.author.id)
                return i.reply({ content: "❌ Bu işlemi sadece komutu kullanan kişi yapabilir.", ephemeral: true });

            if (i.values[0] === "OTHER") {
                const modal = new ModalBuilder()
                    .setCustomId(`ban-custom-${member.id}`)
                    .setTitle("Özel Ban Sebebi");

                const reasonInput = new TextInputBuilder()
                    .setCustomId("customReason")
                    .setLabel("Sebebi girin")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const actionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(actionRow);

                await i.showModal(modal);

                const submitted = await i.awaitModalSubmit({
                    time: 60000,
                    filter: (modalInt) => modalInt.customId === `ban-custom-${member.id}` && modalInt.user.id === message.author.id,
                }).catch(() => null);

                if (submitted) {
                    const reason = submitted.fields.getTextInputValue("customReason");
                    await applyBan({ client, member, reason, author: message.member, message, interaction: submitted });
                } else {
                    return i.followUp({ content: "❌ Sebep girişi zaman aşımına uğradı.", ephemeral: true });
                }
            } else {
                const reason = i.values[0];
                await applyBan({ client, member, reason, author: message.member, message, interaction: i });
            }
        });
    }
};

async function applyBan({ client, member, reason, author, message, interaction }) {
    let data = await PenaltyCounter.findOne({ id: "penalty" });
    if (!data) data = await PenaltyCounter.create({ id: "penalty", count: 1 });
    else data.count += 1;
    await data.save();

    const cezaNo = data.count;

    await Penalty.create({
        userID: member.id,
        userName: member.user.tag,
        staffID: author.id,
        staffName: author.user.tag,
        reason: reason,
        type: "Ban",
        penaltyNo: cezaNo,
        active: true
    });

    await member.ban({ reason });

    const logEmbed = new EmbedBuilder()
        .setTitle(`🔨 Ban Log`)
        .setColor("393A41")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`
**❯ Kullanıcı:** ${member} (\`${member.id}\`)
**❯ Yetkili:** ${message.author} (\`${message.author.id}\`)
**❯ Sebep:** \`${reason}\`
**❯ Ceza No:** \`#${cezaNo}\`
            `)

    const logChannel = client.kanal("ban-log") || client.channels.cache.get(ayar.BAN_LOG);
    if (logChannel) logChannel.send({ embeds: [logEmbed] });

    await interaction.reply({
        content: `✅ ${member} kullanıcısı \`${reason}\` sebebiyle banlandı. (\`#${cezaNo}\`)`,
        ephemeral: true
    });
}
