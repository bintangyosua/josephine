import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const AdviceCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("advice")
    .setDescription("Replies with a random advice"),
  async execute(interaction) {
    // Defer the reply immediately to prevent timeout
    await interaction.deferReply();
    
    const advice = await funServices.getAdvice();

    await interaction.editReply(advice.slip.advice);
  },
};

export default AdviceCommand;
