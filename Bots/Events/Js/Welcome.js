const { Events, EmbedBuilder } = require("discord.js");
const ayar = require("../../../Global.Config.js");

module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client) {
        client.on(Events.GuildMemberAdd, async (member) => {
            const hosgeldinKanal = client.kanal("hosgeldin") || client.kanal(ayar.hosgeldinKanalID);
            const join = client.kanal("join");
            if (!hosgeldinKanal || !join) return;

            const kurulusTarihi = member.user.createdAt;
            const simdi = new Date();
            const farkMs = simdi - kurulusTarihi;
            const yediGunMs = 7 * 24 * 60 * 60 * 1000;
            const guvenliMi = farkMs >= yediGunMs;
            const durum = guvenliMi ? "🟢 Güvenli" : "🔴 Güvenli Değil";

            const embed = new EmbedBuilder()
                .setColor(guvenliMi ? 0x00FF00 : 0xFF0000)
                .setThumbnail(member.user.displayAvatarURL())
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                .setDescription(`\
> 👤 **Kullanıcı:** <@${member.id}> \`(${member.user.tag})\`
> 📥 **Sunucu Üye Sayısı:** \`${member.guild.memberCount}\`
> 🔐 **Hesap Durumu:** \`${durum}\`
> 🕒 **Hesap Oluşturulma:** <t:${Math.floor(kurulusTarihi.getTime() / 1000)}:R>
                `)
                .setFooter({ text: "Yeni Üye Katıldı", iconURL: member.guild.iconURL() })
                .setTimestamp();

            hosgeldinKanal.send({ content: `<@${member.id}>`, embeds: [embed] }).catch(() => { });
            join.send(`${client.emoji("yes")}  Sunucuya yeni üye katıldı: <@${member.id}> | Şu anki üye sayısı: **${member.guild.memberCount}**`).catch(() => { });
        });

        client.on(Events.GuildMemberRemove, async (member) => {
            const leave = client.kanal("leave") || client.kanal(ayar.çıkışLog);
            if (!leave) return;
            leave.send(`${client.emoji("no")}  Sunucudan bir üye ayrıldı: <@${member.id}> | Şu anki üye sayısı: **${member.guild.memberCount}**`).catch(() => { });
        });
    }
};
