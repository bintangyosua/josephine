"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../../lib/api/users");
const ProfileCommand = {
    category: "ℹ️  Info",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("profile")
        .setDescription("Show your profile"),
    async execute(interaction) {
        const user = await users_1.usersService.getUserByDiscordId(interaction.user.id);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Profile")
            .setColor("Red")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
            text: `Sent by ${interaction.user.username} via /profile`,
        });
        if (interaction.guild?.id) {
            console.log("masuk sini");
            embed.setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL() ?? "",
            });
        }
        // Kumpulkan semua fields dalam array
        const fields = [
            {
                name: "Username",
                value: interaction.user.username,
                inline: true,
            },
        ];
        if (interaction.member) {
            fields.push({
                name: "Name",
                value: interaction.member.user.username ?? "",
                inline: true,
            });
            fields.push({
                name: "\u200B", // zero-width space, jadi spacer
                value: "\u200B",
                inline: true,
            });
        }
        fields.push({
            name: "Level",
            value: `${user.data.level}`,
            inline: true,
        }, {
            name: "Total Xp",
            value: `${user.data.totalXp}`,
            inline: true,
        });
        // Set fields sekaligus
        embed.setFields(fields);
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = ProfileCommand;
