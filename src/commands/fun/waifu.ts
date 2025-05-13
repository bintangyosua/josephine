import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const Meme: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("waifu")
    .setDescription("Replies with a random waifu"),
  async execute(interaction) {
    const waifu = await funServices.getWaifu();
    const embed = new EmbedBuilder().setImage(waifu.url);
    interaction.reply({ embeds: [embed] });
  },
};

export default Meme;
