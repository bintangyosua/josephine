import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { githubServices } from "../../lib/api/github";
import { colors } from "../../config"; // Assuming you have a config file for colors

const GitHubCommand: Command = {
  category: "ℹ️ Info",
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Fetches information about a GitHub user.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The GitHub username.")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString("username", true);

    try {
      const userData = await githubServices.getUser(username);

      console.log({ userData });

      if (!userData) {
        await interaction.reply({
          content:
            "Could not fetch information for that GitHub user. Please ensure the username is correct and the user exists.",
          ephemeral: true,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(colors.primary || "#0099ff") // Use a primary color from your config or a default
        .setAuthor({
          name: userData.login,
          iconURL: userData.avatar_url,
          url: userData.html_url,
        })
        .setThumbnail(userData.avatar_url)
        .addFields(
          { name: "Username", value: userData.login, inline: true },
          { name: "Name", value: userData.name || "N/A", inline: true },
          {
            name: "Public Repos",
            value: userData.public_repos.toString(),
            inline: true,
          },
          {
            name: "Followers",
            value: userData.followers.toString(),
            inline: true,
          },
          {
            name: "Following",
            value: userData.following.toString(),
            inline: true,
          },
          // Bio can be long, so it's better not inline
          { name: "Bio", value: userData.bio || "N/A", inline: false }
        )
        .setFooter({
          text: "Information from GitHub API",
          iconURL: interaction.client.user?.displayAvatarURL(), // Optional: bot icon
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in GitHub command execute:", error);
      await interaction.reply({
        content:
          "An unexpected error occurred while fetching GitHub user information.",
        ephemeral: true,
      });
    }
  },
};

export default GitHubCommand;
