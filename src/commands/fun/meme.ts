import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const Meme: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Replies with a random meme"),
  async execute(interaction) {
    const meme = await funServices.getMeme();

    interaction.reply(meme.url);
  },
};

export default Meme;
