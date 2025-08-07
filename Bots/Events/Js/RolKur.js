const { Events } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu()) return;
            const { customId, values, member, guild } = interaction;
            if (!member || !guild) return;
            const uyrukRolleri = { "uyruk_turkiye": ayar.türkiye, "uyruk_almanya": ayar.almanya, "uyruk_amerika": ayar.amerika, "uyruk_fransa": ayar.fransa, "uyruk_ingiltere": ayar.ingiltere, "uyruk_italya": ayar.italya, };
            const inancRolleri = { "inanc_musluman": ayar.müsluman, "inanc_hristiyan": ayar.hristiyan, "inanc_ateist": ayar.ateist, "inanc_musevi": ayar.musevi, "inanc_budist": ayar.budist, "inanc_deist": ayar.deist };
            const selectedValue = values[0];

            try {
                if (customId === "rol_al_uyruk") {
                    const rollerToRemove = Object.values(uyrukRolleri).filter(roleId => member.roles.cache.has(roleId));
                    if (rollerToRemove.length > 0) await member.roles.remove(rollerToRemove);

                    const rolId = uyrukRolleri[selectedValue];
                    if (rolId) await member.roles.add(rolId);

                    await interaction.reply({ content: "Uyruk rolünüz başarıyla güncellendi!", ephemeral: true });
                } else if (customId === "rol_al_inanc") {
                    const rollerToRemove = Object.values(inancRolleri).filter(roleId => member.roles.cache.has(roleId));
                    if (rollerToRemove.length > 0) await member.roles.remove(rollerToRemove);
                    const rolId = inancRolleri[selectedValue];
                    if (rolId) await member.roles.add(rolId);

                    await interaction.reply({ content: "İnanç rolünüz başarıyla güncellendi!", ephemeral: true });
                }
            } catch (error) {
                console.error("Rol verme işleminde hata:", error);
                if (!interaction.replied) {
                    await interaction.reply({ content: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.", ephemeral: true });
                }
            }
        });
    }
};
