const { EmbedBuilder } = require("discord.js");
const Penalty = require('../../../models/penalty');
const ayar = require('../../../Global.Config.js');

module.exports = {
    conf: {
        name: "cezano",
        aliases: ["cezainfo", "cezabilgi", "cezaid", "cezano"],
        description: "Belirtilen Ceza ID'sine ait bilgileri gösterir.",
        usage: ".cezano <Ceza ID>",
        category: "Moderasyon",
    },

    execute: async (client, message, args) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        const cezaID = Number(args[0]);
        if (!cezaID) {
            return message.reply(`${client.emoji("no")} Geçerli bir ceza ID'si belirtmelisin.`);
        }

        const ceza = await Penalty.findOne({ penaltyNo: cezaID });
        if (!ceza) {
            return message.reply(`${client.emoji("no")} ${cezaID} numaralı bir ceza kaydı bulunamadı.`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Ceza Bilgisi: #${ceza.penaltyNo}`)

            .setDescription(`
❯ Kullanıcı: <@${ceza.userID}> (\`${ceza.userID}\`)
❯ Yetkili: <@${ceza.staffID}> (\`${ceza.staffID}\`)
❯ Ceza Türü: \`\` ${ceza.type} \`\`
❯ Sebep: \`\` ${ceza.reason || "Belirtilmemiş"} \`\`
❯ Başlangıç: <t:${Math.floor(ceza.date.getTime() / 1000)}:f>
❯ Bitiş: ${ceza.finishDate ? `<t:${Math.floor(new Date(ceza.finishDate).getTime() / 1000)}:f>` : "Kalıcı"}
❯ Aktif mi?: ${ceza.active ? "✅ Evet" : "❌ Hayır"}
                `)

            .setColor("393A41");

        message.channel.send({ embeds: [embed] });
    }
};
