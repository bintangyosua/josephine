import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { starRailClient } from "../../lib/api/starrail"; // Assuming this path is correct
import { colors } from "../../config"; // Assuming config for colors

const HsrProfileCommand: Command = {
  category: "🕹️ Game",
  data: new SlashCommandBuilder()
    .setName("hsr-profile")
    .setDescription(
      "Fetches a Honkai Star Rail player's profile using their UID."
    )
    .addStringOption((option) =>
      option
        .setName("uid")
        .setDescription("The player's Honkai Star Rail UID.")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const uid = interaction.options.getString("uid", true);

    await interaction.deferReply();

    try {
      const user = await starRailClient.fetchUser(uid);

      if (!user) {
        // This case might not be hit if fetchUser throws an error directly
        // but good to have as a fallback.
        await interaction.editReply({
          content: `Could not fetch profile for UID: ${uid}. Please check the UID and try again. The user might not exist or their data is not public.`,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(colors.primary || "#0099ff") // Use a primary color from your config or a default
        .setTitle(`Honkai Star Rail Profile: ${user.nickname}`)
        .setThumbnail(user.icon.url) // Assuming user.icon has a url property for the avatar
        .addFields(
          { name: "UID", value: user.uid.toString(), inline: true },
          { name: "Nickname", value: user.nickname, inline: true },
          {
            name: "Trailblaze Level",
            value: user.level.toString(),
            inline: true,
          },
          {
            name: "Equilibrium Level (World)",
            value: user.equilibriumLevel.toString(),
            inline: true,
          },
          {
            name: "Friends",
            value: user.friends.toString(),
            inline: true,
          },
          {
            name: "Achievements",
            value: user.achievementCount.toString(),
            inline: true,
          }
        );

      if (user.signature) {
        embed.addFields({
          name: "Signature",
          value: user.signature,
          inline: false,
        });
      }

      if (user.starfaringCompanions && user.starfaringCompanions.length > 0) {
        const showcaseCharacters = user.starfaringCompanions
          .map((character) => character.name.get("en") || character.id) // Fallback to ID if name is not available
          .join(", ");
        embed.addFields({
          name: "Characters in Showcase",
          value: showcaseCharacters,
          inline: false,
        });
      } else {
        embed.addFields({
          name: "Characters in Showcase",
          value: "No characters in showcase or data not public.",
          inline: false,
        });
      }
      
      // Add a link to Enka.Network profile if possible
      // The library's EnkaUser might have a URL or user.enkaUserHash could be used
      if (user.enkaUserHash) {
          embed.setURL(`https://enka.network/hsr/${user.uid}/`);
          embed.setFooter({ text: `View on Enka.Network | UID: ${user.uid}`, iconURL: user.icon.url });
      } else {
          embed.setFooter({ text: `UID: ${user.uid}`, iconURL: user.icon.url });
      }


      embed.setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      console.error(`Error fetching HSR profile for UID ${uid}:`, error);
      let errorMessage = `Could not fetch profile for UID: ${uid}. `;
      if (error.message && error.message.includes("User Not Found")) {
          errorMessage += "The user was not found. Please check the UID.";
      } else if (error.message && error.message.includes("Invalid UID")) {
          errorMessage += "The UID format is invalid.";
      } else if (error.message) {
          errorMessage += `Details: ${error.message}`;
      } else {
          errorMessage += "An unknown error occurred. The profile might be private or the API is temporarily unavailable.";
      }
      
      await interaction.editReply({
        content: errorMessage,
      });
    }
  },
};

export default HsrProfileCommand;
