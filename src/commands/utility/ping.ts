import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

const PingCommand: Command = {
  category: "⚙️  Utility",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),
  async execute(interaction) {
    await interaction.reply(
      `🏓 Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`
    );
  },
};

export default PingCommand;
