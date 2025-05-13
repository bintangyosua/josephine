import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/command";
import { ExtendedClient } from "../../client/extended-client";

const HelpCommand: Command = {
  category: "ℹ️  Info",
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
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setDescription("Here are the available commands grouped by category:")
      .setColor(0x00ae86);

    for (let [category, cmds] of commandMap) {
      embed.addFields({
        name: category,
        value: cmds.map((cmd) => `\`${cmd}\``).join(", "),
        inline: true,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};

export default HelpCommand;
