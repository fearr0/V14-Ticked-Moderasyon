# 💠 V14-Ticked-Moderasyon

Merhaba!  
Önceden ufak çaplı geliştirdiğim bu moderasyon botunu sizlerle paylaşmak istedim. Eğer işinize yararsa ne mutlu bana!  
Bir ⭐ bırakmanız beni çok mutlu eder 😉  

---

## 📌 Özellikler

- Kullanıcı rollerini otomatik atar
- Giriş / çıkış log sistemi
- Mesaj ve rol logları
- Mute, unmute, ban, jail sistemleri
- Kayıtsız / üye rol yönetimi
- Destek bileti kategorisi ve kanalı
- Din, ülke gibi özel rol butonları
- Durum mesajı ayarlama (WATCHING, etc.)
- Geliştiriciye özel alanlar

---

## 📂 Kurulum

### 1. Gerekli Paketleri Kur

```bash
npm install
```

```js
Settings.js Dosyasını Düzenle
module.exports = {
    token: '', // Bot Token
    prefix: ['!', '.'], // Komut Ön Ekleri
    mongoURI: 'mongodb://127.0.0.1:27017/' // MongoDB URI
};
```

```js
Global.Config.js Dosyasını Doldur
module.exports = {
    ID: '', // Sunucu Id
    clientId: "", // Bot Id
    ServerName: '', // Sunucu İsmi
    kurucuPerms: [], // Kurucu Rolleri
    BotOwner: [], // Bot Owner
    BOT_VOICE_CHANNEL: '', // Bot Kanalı
    BOT_TYPE: 'WATCHING', // Bot Türü
    BOT_SET_STATUS: 'dnd', // online, dnd, idle, invisible (görünmeze alma)
    URL: "https://www.twitch.tv/kaicenat", // Bot URL
    BOT_STATUS: ['Developer by Feâr'], // Bot Durumu


    memberRolID: "",        // Üye Rolü
    unregisterRolID: "",    // Kayıtlı Olmayan Rolü
    YetkiliRoleID: "",      // Yetkili Rolü
    hosgeldinKanalID: "",   // Hoşgeldin Kanalı
    destekKategori: "",     // Destek Kategorisi
    destekKanalID: "",      // Destek Kanalı
    yorumKanalID: "",       // Yorum Kanalı

    müsluman: "",           // Müslüman Rolü
    hristiyan: "",          // Hristiyan Rolü
    ateist: "",             // Ateist Rolü
    musevi: "",             // Musevi Rolü
    budist: "",             // Budist Rolü
    deist: "",              // Deist Rolü

    türkiye: "",            // Türkiye Rolü
    almanya: "",            // Almanya Rolü
    amerika: "",            // Amerika Rolü
    fransa: "",             // Fransa Rolü
    ingiltere: "",          // İngiltere Rolü
    italya: "",             // İtalya Rolü

    çıkışLog: "",           // Çıkış Logu
    messageLog: "",         // Mesaj Logu
    messageDeleteLog: "",   // Mesaj Silinme Logu
    roleLog: "",            // Rol Logu

    BAN_LOG: "",            // Ban Logu
    JAİL_LOG: "",           // Jail Logu
    MUTED_LOG: "",          // Mute Logu
    UNMUTE_LOG: "",         // Unmute Logu
    jailRole: "",           // Cezalı Rolü
    muteRole: "",           // Chat Mute Rolü

}
```

```bash
Botu Başlatma Komutu: node app.js (Terminal)
```
