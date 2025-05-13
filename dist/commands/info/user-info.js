"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const command = {
    category: "ℹ️  Info",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("user-info")
        .setDescription("🔍 User Info requested by user")
        .addUserOption((option) => option.setName("target").setDescription("Target user").setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser("target") || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);
        const flags = user.flags?.toArray() || [];
        // Format badge jadi string
        const badges = flags.length > 0
            ? flags.map((flag) => `\`${flag}\``).join(", ")
            : "Tidak ada";
        // Ambil roles (kecuali @everyone)
        const roles = member
            ? member.roles.cache
                .filter((role) => role.id !== interaction.guild?.id)
                .map((role) => role.toString())
                .join(", ") || "Tidak ada"
            : "Tidak ada";
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(config_1.colors.red)
            .setAuthor({ iconURL: user.displayAvatarURL(), name: user.tag })
            .setDescription(user.toString())
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields({
            name: "ID",
            value: user.id,
            inline: true,
        }, {
            name: "Created Date",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        }, ...(member
            ? [
                {
                    name: "Joined Date",
                    value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
                },
            ]
            : []), {
            name: "Badges",
            value: badges,
            inline: false,
        }, {
            name: "Roles",
            value: roles,
            inline: false,
        })
            .setFooter({
            text: `${interaction.client.user.tag} ${interaction.guild ? "| " + interaction.guild.name : ""} `,
            iconURL: interaction.client.user?.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = command;
