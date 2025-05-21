"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../../lib/api/users");
const canvas_1 = require("../../lib/canvas");
const LeaderboardCommand = {
    category: "ℹ️  Info",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Show Global Leaderboard"),
    async execute(interaction) {
        const response = await users_1.usersService.leaderboard();
        const rankingData = (0, canvas_1.convertToRankingData)(response.data);
        const buffer = await (0, canvas_1.generateRankingImageBuffer)(rankingData);
        const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: "rankings.png" });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Global Leaderboard")
            .setDescription("`All-time Rankings`")
            .addFields({
            name: "🗨️ About",
            value: `This leaderboard shows the top players globally based on their all-time performance and achievements. Compete, climb the ranks, and see where you stand among the best!`,
        })
            .setThumbnail("https://i.postimg.cc/ZnJVDFQ9/globe.png")
            .setImage("attachment://rankings.png")
            .setFooter({ text: `Sent by ${interaction.user.username} via /profile` })
            .setTimestamp()
            .setColor(0x5865f2);
        interaction.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
exports.default = LeaderboardCommand;
