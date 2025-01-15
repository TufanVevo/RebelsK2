const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

module.exports = {
    name: "hesap-sil",
    description: "Belirtilen kullanıcı adına ait hesabı siler.",
    options: [
        {
            name: "kullanıcı-adı",
            description: "Silinecek hesabın kullanıcı adı",
            type: 3,
            required: true
        }
    ],
    async run(client, interaction) {
        if (!interaction.member.roles.cache.has(config.DELETE_PERM)) {
            return interaction.reply({ content: "Yetkin yetersiz.", ephemeral: true });
        }

        const kullaniciAdi = interaction.options.getString("kullanıcı-adı");

        const databasePath = path.join(__dirname, "..", "database.json");

        let database;
        try {
            const data = fs.readFileSync(databasePath, "utf8");
            database = JSON.parse(data);
        } catch (error) {
            console.error("Dosya okuma hatası:", error);
            return interaction.reply({ content: "Veritabanı okunurken bir hata oluştu.", ephemeral: true });
        }

        if (database.hasOwnProperty(kullaniciAdi)) {
            delete database[kullaniciAdi];

            try {
                fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
            } catch (error) {
                console.error("Dosya yazma hatası:", error);
                return interaction.reply({ content: "Veritabanı güncellenirken bir hata oluştu.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setTitle("Hesap Silme İşlemi")
                .setDescription(`✅ **${kullaniciAdi}** adlı hesap başarıyla silindi.`)
                .addFields({ name: "Kalan Hesap Sayısı", value: `📦 **${Object.keys(database).length}**` })
                .setFooter({ text: `İşlemi Yapan: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: `❌ **${kullaniciAdi}** adlı hesap bulunamadı.`, ephemeral: true });
        }
    }
};