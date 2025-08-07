const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const Penalty = require('../../../models/penalty');
const SavedRoles = require('../../../models/savedRoles');
const ayar = require('../../../Global.Config.js');

module.exports = {
    conf: {
        name: "Af",
        aliases: ["cezaaf", "af"],
        description: "Kullanıcının aktif cezalarını affetmek için menü ile seçim yapar.",
        usage: ".af @kullanıcı",
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
        if (!member) return message.reply(`${client.emoji("no")} Lütfen geçerli bir kullanıcı etiketleyin veya ID girin.`);

        const cezalar = await Penalty.find({ userID: member.id, active: true });
        if (!cezalar.length) return message.reply(`${client.emoji("no")} Bu kullanıcının aktif cezası bulunmuyor.`);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("cezaAfla")
            .setPlaceholder("Affedilecek cezaları seçin.")
            .setMinValues(1)
            .setMaxValues(cezalar.length)
            .addOptions(
                cezalar.map(c => ({
                    label: `${c.type} (#${c.penaltyNo})`,
                    description: `Sebep: ${c.reason}`,
                    value: c.penaltyNo.toString(),
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const msg = await message.reply({
            content: `${client.emoji("fear")} Affedilecek cezaları seçin:`,
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 30000,
            max: 1,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.user.id !== message.author.id)
                return interaction.reply({ content: "Bu menüyü sadece komutu kullanan kişi kullanabilir.", ephemeral: true });

            const secilenIDs = interaction.values.map(id => parseInt(id));
            const secilenCezalar = cezalar.filter(c => secilenIDs.includes(c.penaltyNo));

            for (const ceza of secilenCezalar) {
                ceza.active = false;
                await ceza.save();

                if (["JAIL", "MUTE"].includes(ceza.type)) {
                    const savedData = await SavedRoles.findOne({ userID: member.id });
                    if (ceza.type === "JAIL" && member.roles.cache.has(ayar.jailRole)) {
                        await member.roles.remove(ayar.jailRole).catch(() => { });
                    }
                    if (ceza.type === "MUTE" && member.roles.cache.has(ayar.muteRole)) {
                        await member.roles.remove(ayar.muteRole).catch(() => { });
                    }

                    if (savedData) {
                        await member.roles.set(savedData.roles).catch(() => { });
                        await SavedRoles.deleteOne({ userID: member.id });
                    }
                }
            }

            const embed = new EmbedBuilder()
                .setColor("393A41")
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${client.emoji("yes")} ${member} kullanıcısının ${secilenCezalar.length} cezası affedildi.`);

            await interaction.update({ content: "", embeds: [embed], components: [] });
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                msg.edit({ content: "Zaman aşımı. Menü iptal edildi.", components: [] });
            }
        });
    },
};
