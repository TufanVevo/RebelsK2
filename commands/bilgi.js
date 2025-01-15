const { EmbedBuilder } = require("discord.js");
const database = require("../database.json");

module.exports = {
    name: "bilgi",
    description: "Kayıtlı hesap bilgisini gösterir.",
    async run(client, interaction) {
        let accountCount = Object.keys(database).length;

        const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setTitle("Kayıtlı Hesap Bilgisi")
            .setDescription(`📦 Kayıtlı Hesap -> **${accountCount}**`)
            .setFooter({ text: `Sorgulayan: ${interaction.user.username}` })
        interaction.reply({ embeds: [embed] });
    }
};