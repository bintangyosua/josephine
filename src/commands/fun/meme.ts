import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const Meme: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Replies with a random meme"),
  async execute(interaction) {
    // Defer the reply immediately to prevent timeout
    await interaction.deferReply();
    
    const meme = await funServices.getMeme();

    await interaction.editReply(meme.url);
  },
};

export default Meme;
