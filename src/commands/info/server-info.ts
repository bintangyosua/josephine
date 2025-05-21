import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  User,
} from "discord.js";
import { Command } from "../../types/command";

const command: Command = {
  category: "ℹ️  Info",
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Show information about server"),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    if (!guild) {
      interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });

      return;
    }

    const memberCount = guild.memberCount;
    const serverName = guild.name;
    const serverRegion = guild.preferredLocale;
    const serverIcon = guild.iconURL();

    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(guild.description)
      .setTitle(`Server Info for ${serverName}`)
      .setThumbnail(serverIcon)
      .addFields(
        { name: "Server Name", value: serverName, inline: true },
        { name: "Member Count", value: `${memberCount}`, inline: true },
        { name: "Region", value: serverRegion, inline: true },
        {
          name: "Created At",
          value: `${guild.createdAt.toISOString().slice(0, 10)}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
