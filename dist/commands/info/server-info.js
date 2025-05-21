"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    category: "ℹ️  Info",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("server-info")
        .setDescription("Show information about server"),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) {
            interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }
        const memberCount = guild.memberCount;
        const serverName = guild.name;
        const serverRegion = guild.preferredLocale;
        const serverIcon = guild.iconURL();
        // Create an embed message
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0099ff")
            .setDescription(guild.description)
            .setTitle(`Server Info for ${serverName}`)
            .setThumbnail(serverIcon)
            .addFields({ name: "Server Name", value: serverName, inline: true }, { name: "Member Count", value: `${memberCount}`, inline: true }, { name: "Region", value: serverRegion, inline: true }, {
            name: "Created At",
            value: `${guild.createdAt.toISOString().slice(0, 10)}`,
            inline: true,
        })
            .setTimestamp()
            .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
        });
        // Send the embed
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = command;
