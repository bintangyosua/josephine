import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  User,
  ChannelType,
  VerificationLevel,
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

    // Fetch additional guild information
    const owner = await guild.members.fetch(guild.ownerId);
    const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;
    const roleCount = guild.roles.cache.size;
    const verificationLevel = VerificationLevel[guild.verificationLevel];


    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(guild.description || "No server description.")
      .setTitle(`Server Info for ${serverName}`)
      .setThumbnail(serverIcon)
      .addFields(
        { name: "Server Name", value: serverName, inline: true },
        { name: "Owner", value: owner ? owner.user.tag : "Unknown", inline: true },
        { name: "Member Count", value: `${memberCount}`, inline: true },
        { name: "Region", value: serverRegion, inline: true },
        { name: "Verification Level", value: verificationLevel, inline: true },
        { name: "Role Count", value: `${roleCount}`, inline: true },
        {
          name: "Channels",
          value: `${textChannels} Text, ${voiceChannels} Voice, ${categories} Categories`,
          inline: false,
        },
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
