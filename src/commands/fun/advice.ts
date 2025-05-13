import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const AdviceCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("advice")
    .setDescription("Replies with a random advice"),
  async execute(interaction) {
    const advice = await funServices.getAdvice();

    interaction.reply(advice.slip.advice);
  },
};

export default AdviceCommand;
