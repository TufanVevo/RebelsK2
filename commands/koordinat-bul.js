const { EmbedBuilder } = require("discord.js");
const database = require("../database.json");
const config = require("../config.json");

module.exports = {
    name: "koordinat",
    description: "Koordinat bulma.",
    options: [
        {
            name: "bul",
            description: "Koordinat bulma.",
            type: 1,
            options: [
                { name: "dünya", description: "Dünya giriniz.", type: 3, required: true },
                { name: "x", description: "x konumu giriniz.", type: 4, required: true },
                { name: "y", description: "y konumu giriniz.", type: 4, required: true }
            ]
        }

    ],
    run: async (client, interaction) => {
        if (!interaction.member.roles.cache.has(config.PERM)) return interaction.reply({ content: "Yetkin yetersiz.", ephemeral: true });
        const world = interaction.options.getString("dünya");
        const x = interaction.options.getInteger("x");
        const y = interaction.options.getInteger("y");

        let closestUser = null;
        let closestDistance = Infinity;

        for (const user in database) {
            const userCoordinates = database[user][world];
            if (userCoordinates) {
                const userX = userCoordinates.x;
                const userY = userCoordinates.y;

                const distance = Math.sqrt((userX - x) ** 2 + (userY - y) ** 2);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestUser = user;
                }
            }
        }

        if (closestUser) {
            const userX = database[closestUser][world].x;
            const userY = database[closestUser][world].y;
            const embed = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setTitle("En Yakın Kullanıcı")
                .setDescription("Aşağıda bilgiler yer almaktadır.")
                .addFields([
                    { name: "👤 Kullanıcı", value: `${closestUser}`, inline: true },
                    { name: "🌎 Dünya", value: `${world}`, inline: true },
                    { name: "🗺️ X Koordinat", value: `${userX}`, inline: true },
                    { name: "🗺️ Y Koordinat", value: `${userY}`, inline: true },
                    { name: "🛤️ Aradaki Mesafe", value: `${closestDistance}`, inline: true }
                ])
                .setFooter({ text: `Sorgulayan: ${interaction.user.username}` })
            interaction.reply({ embeds: [embed] });
            return;
        } else {
            interaction.reply({ content: "Belirtilen dünyada hiç kullanıcı bulunamadı.", ephemeral: true });
        }
    }
};
