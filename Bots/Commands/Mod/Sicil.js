const { EmbedBuilder } = require("discord.js");
const Penalty = require('../../../models/penalty');
const ayar = require('../../../Global.Config.js');

module.exports = {
    conf: {
        name: "sicil",
        aliases: ["cezalar", "cezasicil", "sicil"],
        description: "Bir kullanıcının ceza sicilini görüntüler.",
        usage: ".sicil @kullanıcı / .sicil <id>",
        category: "Moderasyon",
    },

    execute: async (client, message, args) => {
        let member;

        if (message.mentions.members.first()) {
            member = message.mentions.members.first();
        } else if (args[0]) {
            try {
                member = await message.guild.members.fetch(args[0]);
            } catch {
                // Kullanıcı sunucuda değil veya ID geçersiz olabilir
                const cezalar = await Penalty.find({ userID: args[0] }).sort({ _id: -1 });
                if (!cezalar.length) return message.reply(`${client.emoji("no")} Belirttiğiniz ID'ye ait ceza bulunamadı.`);

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${args[0]} ID'li kullanıcının ceza sicili` })
                    .setColor("393A41")
                    .setDescription(cezalar.slice(0, 10).map((ceza, index) =>
                        `\`#${ceza.penaltyNo}\` • **${ceza.type}** | **${ceza.reason}**
**Yetkili:** <@${ceza.staffID}> | **Tarih:** <t:${Math.floor(new Date(ceza._id.getTimestamp()).getTime() / 1000)}:R>`).join("\n"))
                    .setFooter({ text: `${ayar.ServerName} • Toplam Ceza: ${cezalar.length}` });

                return message.channel.send({ embeds: [embed] });
            }
        } else {
            member = message.member;
        }

        const cezalar = await Penalty.find({ userID: member.id }).sort({ _id: -1 });

        if (!cezalar || cezalar.length === 0) {
            return message.reply(`${client.emoji("no")} ${member} kullanıcısının herhangi bir cezası bulunmamaktadır.`);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.tag} kullanıcısının ceza sicili`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setColor("393A41")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(cezalar.slice(0, 10).map((ceza, index) =>
                `\`#${ceza.penaltyNo}\` • **${ceza.type}** | **${ceza.reason}**
**Yetkili:** <@${ceza.staffID}> | **Tarih:** <t:${Math.floor(new Date(ceza._id.getTimestamp()).getTime() / 1000)}:R>`).join("\n"))
            .setFooter({ text: `${ayar.ServerName} • Toplam Ceza: ${cezalar.length}` });

        message.channel.send({ embeds: [embed] });
    }
};
