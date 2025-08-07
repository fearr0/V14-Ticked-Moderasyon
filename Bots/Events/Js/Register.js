const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client) {
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isButton() && interaction.customId === "kayit_button") {
                const modal = new ModalBuilder()
                    .setCustomId("kayit_modal")
                    .setTitle("Kayıt Formu");

                const nameInput = new TextInputBuilder()
                    .setCustomId("isim")
                    .setLabel("Adınız")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const ageInput = new TextInputBuilder()
                    .setCustomId("yas")
                    .setLabel("Yaşınız")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(nameInput),
                    new ActionRowBuilder().addComponents(ageInput)
                );

                await interaction.showModal(modal);
            }

            if (interaction.isModalSubmit() && interaction.customId === "kayit_modal") {
                const rawIsim = interaction.fields.getTextInputValue("isim");
                const yas = interaction.fields.getTextInputValue("yas");
                const member = interaction.member;

                const isimTemiz = rawIsim.trim().toLowerCase();

                const filtreKelimeler = [
                    "discord.gg", ".com", ".net", ".org", ".xyz", ".tk", ".co", ".ru", "http", "https", "www",
                    "amk", "siktir", "orospu", "yarrak", "piç", "aq", "anan", "sik", "salak", "aptal"
                ];

                const xRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

                if (xRegex.test(isimTemiz) || filtreKelimeler.some(kelime => isimTemiz.includes(kelime))) {
                    return await interaction.reply({
                        content: `${client.emoji("no")} İsminizde uygunsuz içerik veya reklam tespit edildi. Lütfen tekrar deneyin.`,
                        ephemeral: true
                    });
                }

                if (isNaN(yas) || parseInt(yas) > 60 || parseInt(yas) < 10) {
                    return await interaction.reply({
                        content: `${client.emoji("no")}  Geçersiz yaş girdiniz. Yaşınız 10 ile 60 arasında olmalıdır.`,
                        ephemeral: true
                    });
                }

                const accountCreation = member.user.createdAt;
                const now = new Date();
                const diffMs = now - accountCreation;
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

                if (diffMs < sevenDaysMs) {
                    return await interaction.reply({
                        content: `${client.emoji("no")}  Hesabınız 7 günden daha yeni olduğu için kayıt olamazsınız.`,
                        ephemeral: true
                    });
                }

                const isim = rawIsim.charAt(0).toUpperCase() + rawIsim.slice(1).toLowerCase();
                const memberRolID = ayar.memberRolID;
                const unregisterRolID = ayar.unregisterRolID;

                try {
                    const nickname = `${isim} ${yas}`;
                    await member.setNickname(nickname).catch(() => { });
                    await member.roles.add(memberRolID);
                    await member.roles.remove(unregisterRolID);
                    await interaction.reply({
                        content: `${client.emoji("yes")} Kayıt başarıyla tamamlandı!\n**İsim:** ${isim}\n**Yaş:** ${yas}`,
                        ephemeral: true
                    });
                } catch (err) {
                    console.error("Rol/isim güncelleme hatası:", err);
                    await interaction.reply({
                        content: `${client.emoji("no")}  Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.`,
                        ephemeral: true
                    });
                }
            }
        });
    }
};
