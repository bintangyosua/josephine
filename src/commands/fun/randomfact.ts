import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const RandomFactCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("randomfact")
    .setDescription("Replies with a random interesting fact."),
  execute: async (interaction) => {
    const fact = await funServices.getRandomFact();
    await interaction.reply(fact);
  },
};

export default RandomFactCommand;
