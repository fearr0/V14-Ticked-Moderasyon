const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const ayar = require("../../../Global.Config.js");
module.exports = {
    conf: {
        name: "RolKur",
        aliases: ["rolkur", "rolkurulum"],
        description: "Rol alma sistemi için menüyü kurar.",
        category: "admin",
        usage: ".rolkur",
    },

    execute: async (client, message, args) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }


        const uyrukMenu = new StringSelectMenuBuilder()
            .setCustomId("rol_al_uyruk")
            .setPlaceholder("Uyruk seçin")
            .setMaxValues(1) 
            .addOptions([
                { emoji:`${client.emoji("turkiye")}`, label: "Türkiye", description: "Türkiye uyruk rolü al", value: "uyruk_turkiye" },
                { emoji:`${client.emoji("almanya")}`, label: "Almanya", description: "Almanya uyruk rolü al", value: "uyruk_almanya" },
                { emoji:`${client.emoji("amerika")}`, label: "Amerika", description: "Amerika uyruk rolü al", value: "uyruk_amerika" },
                { emoji:`${client.emoji("fransa")}`, label: "Fransa", description: "Fransa uyruk rolü al", value: "uyruk_fransa" },
                { emoji:`${client.emoji("ingiltere")}`, label: "İngiltere", description: "İngiltere uyruk rolü al", value: "uyruk_ingiltere" },
                { emoji:`${client.emoji("italya")}`, label: "İtalya", description: "İtalya uyruk rolü al", value: "uyruk_italya" },
            ]);

        const inancMenu = new StringSelectMenuBuilder()
            .setCustomId("rol_al_inanc")
            .setPlaceholder("İnanç seçin")
            .setMaxValues(1)
            .addOptions([
                { label: "Müslüman", description: "Müslüman inancı rolü al", value: "inanc_musluman" },
                { label: "Hristiyan", description: "Hristiyan inancı rolü al", value: "inanc_hristiyan" },
                { label: "Ateist", description: "Ateist inancı rolü al", value: "inanc_ateist" },
                { label: "Musevi", description: "Musevi inancı rolü al", value: "inanc_musevi" },
                { label: "Budist", description: "Budist inancı rolü al", value: "inanc_budist" },
                { label: "Deist", description: "Deist inancı rolü al", value: "inanc_deist" },
            ]);

        const row1 = new ActionRowBuilder().addComponents(uyrukMenu);
        const row2 = new ActionRowBuilder().addComponents(inancMenu);

        const embed = new EmbedBuilder()
            .setTitle("Rol Alma Menüsü")
            .setDescription("Aşağıdaki menülerden sadece bir adet **uyruk** ve bir adet **inanç** rolü seçebilirsiniz. Seçiminiz otomatik olarak güncellenecektir.")
            .setColor("393A41");

        await message.channel.send({ embeds: [embed], components: [row1, row2] });
    },
};
