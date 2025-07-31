import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/command";
import { ExtendedClient } from "../../client/extended-client";
import { usersService } from "../../lib/api/users";

const ProfileCommand: Command = {
  category: "ℹ️  Info",
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Show your profile"),
  async execute(interaction) {
    // Defer the reply immediately to prevent timeout
    await interaction.deferReply();
    
    const user = await usersService.getUserByDiscordId(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle("Profile")
      .setColor("Red")
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: `Sent by ${interaction.user.username} via /profile`,
      });

    if (interaction.guild?.id) {
      console.log("masuk sini");
      embed.setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL() ?? "",
      });
    }

    // Kumpulkan semua fields dalam array
    const fields: { name: string; value: string; inline?: boolean }[] = [
      {
        name: "Username",
        value: interaction.user.username,
        inline: true,
      },
    ];

    if (interaction.member) {
      fields.push({
        name: "Name",
        value: interaction.member.user.username ?? "",
        inline: true,
      });
      fields.push({
        name: "\u200B", // zero-width space, jadi spacer
        value: "\u200B",
        inline: true,
      });
    }

    fields.push(
      {
        name: "Level",
        value: `${user.data.level}`,
        inline: true,
      },
      {
        name: "Total Xp",
        value: `${user.data.totalXp}`,
        inline: true,
      }
    );

    // Set fields sekaligus
    embed.setFields(fields);

    await interaction.editReply({ embeds: [embed] });
  },
};

export default ProfileCommand;
