import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/command";
import { ExtendedClient } from "../../client/extended-client";

const HelpCommand: Command = {
  category: "Info",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands by category"),
  async execute(interaction) {
    const client = interaction.client;
    const commandMap = new Map<string, string[]>();

    const extendedClient = client as ExtendedClient;

    extendedClient.commands.forEach((cmd) => {
      if (!commandMap.has(cmd.category)) {
        commandMap.set(cmd.category, []);
      }
      commandMap.get(cmd.category)?.push(`/${cmd.data.name}`);
    });

    const embed = new EmbedBuilder()
      .setTitle("📖 Help Menu")
      .setDescription("Here are the available commands grouped by category:")
      .setColor(0x00ae86);

    for (const [category, cmds] of commandMap) {
      embed.addFields({
        name: category,
        value: cmds.join(", "),
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default HelpCommand;
