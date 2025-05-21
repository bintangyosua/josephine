import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { usersService } from "../../lib/api/users";
import {
  convertToRankingData,
  generateRankingImageBuffer,
} from "../../lib/canvas";

const LeaderboardCommand: Command = {
  category: "ℹ️  Info",
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show Global Leaderboard"),

  async execute(interaction) {
    const response = await usersService.leaderboard();

    const rankingData = convertToRankingData(response.data);
    const buffer = await generateRankingImageBuffer(rankingData);
    const attachment = new AttachmentBuilder(buffer, { name: "rankings.png" });

    const embed = new EmbedBuilder()
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

export default LeaderboardCommand;
