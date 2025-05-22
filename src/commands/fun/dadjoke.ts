import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const DadJokeCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("dadjoke")
    .setDescription("Replies with a random dad joke."),
  execute: async (interaction) => {
    const joke = await funServices.getDadJoke();
    await interaction.reply(joke);
  },
};

export default DadJokeCommand;
