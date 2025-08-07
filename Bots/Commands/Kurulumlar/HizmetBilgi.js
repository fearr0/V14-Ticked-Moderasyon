const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const emojis = require("../../../Global/Config/emoji.json").emojis;
const ayar = require("../../../Global.Config.js");
module.exports = {
    conf: {
        name: "Hizmet",
        aliases: ["hizmet", "service"],
        description: "Sunucunun aktif olarak ",
        usage: ".kurallar",
        category: "admin",
    },

    execute: async (client, message) => {

        const isAuthorized = message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            message.member.roles.cache.has(ayar.YetkiliRoleID);

        if (!isAuthorized) {
            return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine veya belirtilen role sahip olmalısın!");
        }
        
        const hizmetSteamKey = new EmbedBuilder()
            .setTitle("STEAM KEY")
            .setThumbnail("https://media.discordapp.net/attachments/1330324546624159870/1376203877250240664/Steamthm.gif?ex=6834793c&is=683327bc&hm=61e9a312b95e14b4cfa81f08ef13711449b6cc618152e7eeb4c9ae513b9049f1&=&width=820&height=820")
            .setDescription(`
${client.emoji("nokta")} Ürün 7/24 Otomatik Teslim Ediliyor. aktif olmasam bile alabilirsiniz.
───────────────────────────────────────────
${client.emoji("nokta")} 'İstediğiniz özel Oyunlar için DM’den iletişime geçin!'
───────────────────────────────────────────
${client.emoji("nokta")}40$-200$ Dolar arası Oyunlar Çıkmaktadır
───────────────────────────────────────────

⚡ Tamamen Otomatik teslim edilir, oyun ömür boyu kütüphanenizde kalır.
⚡ Sadece oyun çıkar, DLC veya Demo çıkmaz.
⚡ Oyunların indirimsiz fiyatı baz alınmaktadır.
⚡ Hemen Satın Alarak Steam Hesabınızın Değerini Yükseltebilirsiniz.
⚡ Kütüphanenizdeki bir oyun veya aynı oyun çıkarsa değişim sağlanmaz.
⚡ Toplu siparişlerde indirim için mesaj atınız.
⚡ Birden fazla alımlarda aynı oyunlar çıkabilir değişim sağlanmaz. ihtimali (%2)
> Herhangi bir ihtimale karşı satın almadan önce video kaydı başlatın videodayken kodu kullanın herhangi bir problem olması durumunda bize iletirsiniz.

`,
            )
            .setFields({ name: " ", value: `İstediğiniz özel Oyunlar için DM’den iletişime geçiin!` })
            .setColor("393A41");

        // İnstagram Hizmeti

        const instagramHizmet = new EmbedBuilder()
            .setTitle("İNSTAGRAM HİZMETİ")
            .setThumbnail("https://media.discordapp.net/attachments/1330324546624159870/1376203876818092173/Instagramthm.gif?ex=6834793c&is=683327bc&hm=dddef2cc584d5478af9421dc7f44d0326e342429fdbd37d53ffdf3abe0acd59f&=&width=820&height=820")
            .setColor("393A41")
            .addFields(
                { name: "İnstagram Gönderim Süresi", value: `\`\`\`ansi\n[2;35m 1-24 Saat\`\`\``, inline: true },)
            .setDescription(`
───────────────────────────────────────────
\`\`\`ansi\n[2;34m Detaylar:\`\`\`
───────────────────────────────────────────
> Şifreniz Gerekmiyor!
> 0-5 Dakikada Teslimat Garantisi
> %100 Organik Global Takipçi
> +1.500 Takipçi Hediye
> Otomatik Teslimat
> 365 Gün Telafi Garantisi
> 7/24 Destek
───────────────────────────────────────────

⚠️ Ayarlar yapılmaz ise Takipçilerini eksik yansımış gibi olur. Örneğin 1000 takipçi girilmişse, olası spam hesaplar kişinin profilindeki Takipçiler kısmındaki İşaretlenenler menüsüne düşüyor. Yani 1000 hesapta örneğin 800 takipçi direk gidiyor, 200 takipçi istek olarak gidiyor. Bu istekleri manuel olarak onaylamalısınız. Buraya düşen takipçiler silinir ise ASLA telafi veya iade yapılmaz.
───────────────────────────────────────────
1.) Hesap Ayarlarına gidin.,
───────────────────────────────────────────
2.) Takip Et ve Arkadaş Davet Et'i seçin.,
───────────────────────────────────────────
3.) İnceleme için İşaretle seçeneğini bulun ve işaretini kaldırın.,
───────────────────────────────────────────

\`'İstediğiniz özel sayıda Instagram takipçisi için DM’den iletişime geçin!'\`
───────────────────────────────────────────
\`Bizi Tercih Ettiğiniz İçin Teşekkürler.\`
───────────────────────────────────────────
           `)

        const tiktokHizmet = new EmbedBuilder()
            .setTitle("TİKTOK HİZMETİ")
            .setThumbnail("https://media.discordapp.net/attachments/1330324546624159870/1376203892525895720/Tiktokthm.gif?ex=68347940&is=683327c0&hm=64ffa3e6323a4a9bcbc8867a82ef99bbb8c968027170bd77902b3929e0d96920&=&width=950&height=950")
            .setColor("393A41")
            .setDescription(`
Değerli Müşterimiz;
Teknik aksaklığın ardından yeniden tam kapasiteyle hizmet vermeye başladık. Bu süreçteki anlayışınız için teşekkür eder, sizlere en iyi şekilde hizmet sunmaya devam edeceğimizi belirtmek isteriz.

───────────────────────────────────────────
\`\`\`ansi\n[2;34m Detaylar:\`\`\`
───────────────────────────────────────────
> OTOMATİK TESLİMAT
> %100 Gerçek Takipçi
> +150 Takipçi Hediye
> 0-15 Dakika Arasında Başlar
> Düşüşlere Karşı Telafi Garantisi
> Şifreniz Gerekmiyor!
> Hesabınız Gizli Olmamalıdır
───────────────────────────────────────────
\`İstediğiniz özel sayıda Tiktok takipçisi için DM’den iletişime geçin!\`
───────────────────────────────────────────
\`En uygun fiyatlı sosyal medya hizmetleri için bizi tercih edebilirsiniz\`
───────────────────────────────────────────
                `)
            .addFields(
                { name: "Tiktok Gönderim Süresi", value: `\`\`\`ansi\n[2;35m 1-24 Saat\`\`\``, inline: true },
                { name: "Garanti Süresi", value: `\`\`\`ansi\n[2;35m365 Gün\`\`\``, inline: true },
                { name: " ", value: ` `, inline:  true },
                { name: "Gönderim Lokasyonu", value: `\`\`\`ansi\n[2;35mKarışık\`\`\``, inline: true },
            )

        const hizmetDiscord = new EmbedBuilder()
            .setTitle("DISCORD HİZMETİ")
            .setThumbnail("https://media.discordapp.net/attachments/1330324546624159870/1376203876444803142/Discordthm.gif?ex=6834793c&is=683327bc&hm=e202b4c8613394976ed01cf1c3eca87f4fa0b9e531300262ebb2be0acd244f1a&=&width=816&height=820")
            .setColor("393A41")
            .setDescription(`
\`\`  Nedir Bu İlan? \`\`

2.000+ kişili sunucuya sahip olursunuz. Kısa süre içinde hazırlayıp sunucu sahipliğini size aktarıyoruz. Daha fazla / az veya bilgi almak için alt tarafta bulunan metni okuyabilirsiniz.(yoğunluğa 1999-2000 arası teslim edilecektir, herhangi düşüş olursa 2000'e tamamlanacaktır.)
Bu ilan diğer ilanlardan farklıdır, bu ilanın farkı diğer sunucularda kullanılan üyelerin nsfw olması ancak bizim size sattığımız üyeler tamamiyle gerçek sizin bizim gibi davet kasan daha aktif nsfwye göre tek hesaplık değildir, kısacası aktif hesaplardır.
Ayrıca size 2 ay - 2 yıl arası sunucu veriyoruz, yani üyeler oraya gelecek. Bu bizim hediyemizdir 

\`\`  Nasıl Teslim Ediliyor?  \`\`

> İlanımızı aldıktan sonra sunucu açılır ve sunucunuz hazırlanır! (Token Değildir)
───────────────────────────────────────────
> Yetkilendirilen üyelerdir, auth sistemi ile kasılmıştır.
───────────────────────────────────────────
> Token sanıyorsanız yanılıyorsunuz , belirli büyük kitleli sunuculardan izin alınarak DMALL çekiliyor, üyeler binevi şartlı çekiliş gibi botu yetkilendiriyor bu şekilde üyeleri sunucuya giriş yapmasını sağlıyoruz! (Binevi şartlı çekiliş gibi düşünebilirsiniz)
───────────────────────────────────────────
> Üyeler Türk Mü? Yabancı Mı?
───────────────────────────────────────────
> Öncelikle üyeler, yabancı türk karışımlı üyelerdir, bu üyeler karışık kitlelerden kasılmıştır, bunlardan bir kaç tane örnek verirsek, Nitro Sunucuları - Roblox sunucuları, kitlelerinden kasılmıştır, sadece türk hizmetimizde mevcuttur bunun için bana özelden yazabilirsiniz, bu üyeler yetkilendirme sistemi ile sunucunuza dahil edilmektedir, bu üyeler aktiflik gösterebilirler, çıkadabilirler bu tamamiyle sizin sorumluluğunuzdadır.
───────────────────────────────────────────
> Garantili Hizmet +
───────────────────────────────────────────
> Tamamen garantili ve telafili hizmetimiz, %80 üye düşüşü yaşama
───────────────────────────────────────────
> Sunucuyu aldıktannız durumunda 1 kereye mahsus telafi yapılmaktadır.
───────────────────────────────────────────
> Uyarı! sonra aktiflik ve üye çıkışı tamamen size aittir.
───────────────────────────────────────────

> 7/24 Stoklarımız Açıktır İstediğiniZ Özel Nitelikteki Sunucular İçin DM Üzerinden İletişime Geçiniz.
> 1-8 Saat içerisinde hazırlanıp teslim edilmektedir.
> Teslimat süresi zamanında verilmedi ise ancak iade talebinde bulunabilirsiniz bu saatler içinde iade talebi bulunma hakkınız yoktur!
                `)

        const rs = new EmbedBuilder()
            .setTitle("Talep ve Hizmet Bilgi Sistemi")
            .setColor("393A41")
            .setDescription(`
<#${ayar.destekKanalID}> kanalında hizmetlerimiz hakkında bilgi alabilirsiniz.
                `)

        const sosyalMedyaEmbed = new EmbedBuilder().setTitle("SOSYAL MEDYA HESAPLARI").setDescription("Bizi sosyal medyada takip edin!").setColor("393A41");
        const sosyalMedyaButon1 = new ButtonBuilder().setLabel("Tiktok").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("tiktok")}`).setURL("https://twitter.com/");
        const sosyalMedyaButon2 = new ButtonBuilder().setLabel("Instagram").setStyle(ButtonStyle.Link).setEmoji(`${client.emoji("instagram")}`).setURL("https://instagram.com/");
        const row = new ActionRowBuilder().addComponents(sosyalMedyaButon1, sosyalMedyaButon2);

        await message.channel.send({
            embeds: [
                hizmetSteamKey,
                instagramHizmet,
                tiktokHizmet,
                hizmetDiscord,
                rs,
                sosyalMedyaEmbed,
            ],
            components: [row],
        });
    },
};
