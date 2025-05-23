import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  User,
} from "discord.js";
import { Command } from "../../types/command";
import { colors } from "../../config";

const command: Command = {
  category: "ℹ️  Info",
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("User info requested by user")
    .addUserOption((option) =>
      option.setName("target").setDescription("Target user").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);

    const flags = user.flags?.toArray() || [];

    // Format badge jadi string
    const badges =
      flags.length > 0
        ? flags.map((flag) => `\`${flag}\``).join(" ")
        : "Tidak ada";

    // Ambil roles (kecuali @everyone)
    const roles = member
      ? member.roles.cache
          .filter((role) => role.id !== interaction.guild?.id)
          .map((role) => role.toString())
          .join(" ") || "Tidak ada"
      : "Tidak ada";

    // Additional information
    const nickname = member?.nickname || "None";
    const isBot = user.bot ? "Yes" : "No";
    const highestRole = member?.roles.highest?.name || "None";

    let status = "⚫ Offline";
    if (member?.presence) {
      switch (member.presence.status) {
        case "online":
          status = "🟢 Online";
          break;
        case "idle":
          status = "🌙 Idle";
          break;
        case "dnd":
          status = "⛔ Do Not Disturb";
          break;
        // 'offline' is handled by the default
      }
    }

    const embed = new EmbedBuilder()
      .setColor(colors.red)
      .setAuthor({ iconURL: user.displayAvatarURL(), name: user.tag })
      .setDescription(user.toString())
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Nickname", value: nickname, inline: true },
        { name: "Bot?", value: isBot, inline: true },
        { name: "Status", value: status, inline: true },
        { name: "Highest Role", value: highestRole, inline: true },
        { name: "Badges", value: badges, inline: true }, // Changed to inline true for better spacing
        {
          name: "Created Date",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: false,
        },
        ...(member
          ? [
              {
                name: "Joined Date",
                value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>`,
                inline: false,
              },
            ]
          : []),
        {
          name: "Roles",
          value: roles, // This can be long, keeping it non-inline
          inline: false,
        }
      )
      .setFooter({
        text: `${interaction.client.user.tag} ${
          interaction.guild ? "| " + interaction.guild.name : ""
        } `,
        iconURL: interaction.client.user?.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
