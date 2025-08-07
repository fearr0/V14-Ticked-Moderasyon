const { PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const ayar = require("../../../Global.Config.js");

module.exports = {
    conf: {
        name: "emojikur",
        aliases: ["emojiyukle", "emojikur"],
        description: "Sunucuya local emojileri otomatik yükler ve emoji.json dosyasına kaydeder.",
        category: "admin",
    },

    execute: async (client, message, args) => {
        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }

        const emojiFolder = path.join(__dirname, "../../../Global/Assets/Emojis");
        const jsonPath = path.join(__dirname, "../../../Global/Config/emoji.json");

        let emojiData = {};
        if (fs.existsSync(jsonPath)) {
            const raw = fs.readFileSync(jsonPath, "utf-8");
            try {
                emojiData = JSON.parse(raw);
            } catch {
                emojiData = {};
            }
        }

        const files = fs.readdirSync(emojiFolder).filter(file =>
            file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".webp") || file.endsWith(".gif")
        );

        let count = 0;

        for (const file of files) {
            const name = path.parse(file).name;

            if (emojiData[name]) {
                await message.channel.send(`⚠️ Emoji zaten kayıtlı: ${name}`);
                continue;
            }

            try {
                const emoji = await message.guild.emojis.create({
                    attachment: path.join(emojiFolder, file),
                    name: name,
                });

                emojiData[name] = `<:${emoji.name}:${emoji.id}>`;

                count++;
                await message.channel.send(`✅ (${count}/${files.length}) Emoji yüklendi: ${emoji.name} (${emoji.id})`);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err) {
                await message.channel.send(`❌ Emoji yüklenirken hata: ${name} - ${err.message}`);
            }
        }

        fs.writeFileSync(jsonPath, JSON.stringify(emojiData, null, 2), "utf-8");
        await message.channel.send(`🎉 Emoji yükleme tamamlandı! Toplam yüklenen emoji sayısı: ${count}`);
    }
};
