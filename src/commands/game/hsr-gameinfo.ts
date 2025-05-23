import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { starRailClient } from "../../lib/api/starrail";
import { colors } from "../../config";
// Assuming types for events and banners might exist or need to be defined based on actual API response
// For now, we'll use 'any' and adapt if specific types are found/known.
// import { StarRailEvent, StarRailBanner } from "starrail.js"; 

const HsrGameInfoCommand: Command = {
  category: "🕹️ Game",
  data: new SlashCommandBuilder()
    .setName("hsr-gameinfo")
    .setDescription(
      "Provides information about current Honkai Star Rail game events or banners."
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("events")
        .setDescription("Displays current in-game events.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("banners")
        .setDescription("Displays current character and light cone banners.")
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();

    try {
      if (subcommand === "events") {
        // Hypothetical method based on prompt
        // const eventsData = await starRailClient.getStarRailOfficialApiData("events");
        
        // Fallback: If the above method is not found, we'll use a placeholder
        // indicating the feature is not available or docs were insufficient.
        // This part will need to be updated with actual API calls if methods are found.
        
        // Check if the method exists on the client
        if (typeof (starRailClient as any).getStarRailOfficialApiData !== 'function') {
            await interaction.editReply({
                content: "Fetching event information is currently not supported by the library version used or documentation was insufficient to locate the correct method.",
            });
            return;
        }
        
        const eventsData = await (starRailClient as any).getStarRailOfficialApiData("events");


        if (!eventsData || eventsData.length === 0) {
          await interaction.editReply({
            content: "No current Honkai Star Rail events found or data is unavailable.",
          });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor(colors.primary || "#0099ff")
          .setTitle("Current Honkai Star Rail Events")
          .setTimestamp();

        // Assuming eventsData is an array of event objects
        // This structure is hypothetical and needs to be adjusted based on actual API response
        for (const event of eventsData.slice(0, 5)) { // Limit to 5 events for brevity
          const name = event.name || "Unnamed Event";
          let value = "";
          if (event.startTime && event.endTime) {
            // Assuming timestamps are in seconds or can be parsed by Date
            const start = new Date(event.startTime * 1000).toLocaleDateString();
            const end = new Date(event.endTime * 1000).toLocaleDateString();
            value += `**Duration:** ${start} - ${end}\n`;
          }
          if (event.description) {
            value += `**Description:** ${event.description.substring(0, 200)}${event.description.length > 200 ? "..." : ""}\n`;
          }
          if (event.url) {
            value += `[More Info](${event.url})`;
          }
          if (!value) value = "No details available.";
          
          embed.addFields({ name, value: value.trim(), inline: false });
        }
        if (eventsData.length > 5) {
            embed.addFields({ name: "More Events", value: `There are ${eventsData.length - 5} more events not listed here.`, inline: false });
        }


        await interaction.editReply({ embeds: [embed] });

      } else if (subcommand === "banners") {
        // Hypothetical method based on prompt
        // const bannersData = await starRailClient.getGachaInfos();
        
        // Fallback
        if (typeof (starRailClient as any).getGachaInfos !== 'function') {
            await interaction.editReply({
                content: "Fetching banner information is currently not supported by the library version used or documentation was insufficient to locate the correct method.",
            });
            return;
        }

        const bannersData = await (starRailClient as any).getGachaInfos();

        if (!bannersData || bannersData.length === 0) {
          await interaction.editReply({
            content: "No current Honkai Star Rail banners found or data is unavailable.",
          });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor(colors.success || "#57F287") // Different color for banners
          .setTitle("Current Honkai Star Rail Banners")
          .setTimestamp();

        // Assuming bannersData is an array of banner objects
        // This structure is hypothetical and needs to be adjusted
        for (const banner of bannersData) {
          const name = banner.title || banner.name || "Unnamed Banner";
          let value = "";
          if (banner.featured_5_star) { // Hypothetical property
            value += `**5★:** ${banner.featured_5_star}\n`;
          }
          if (banner.featured_4_stars && banner.featured_4_stars.length > 0) { // Hypothetical
            value += `**4★:** ${banner.featured_4_stars.join(", ")}\n`;
          }
          if (banner.endTime) {
            // Assuming timestamp is in seconds or can be parsed
            const end = new Date(banner.endTime * 1000).toLocaleString();
            value += `**Ends:** ${end}\n`;
          }
          if (!value) value = "Details unavailable.";

          embed.addFields({ name, value: value.trim(), inline: true }); // Banners often fit inline

          if (banner.image_url) { // Hypothetical property for banner image
            // For multiple banners, setting image for each isn't ideal in one embed.
            // Consider setting the first banner's image or a generic HSR image.
            if (!embed.data.image) embed.setImage(banner.image_url);
          }
        }
        
        if(!embed.data.image) {
            // Fallback image if no banner-specific image was found/set
            // embed.setImage("URL_TO_A_GENERIC_HSR_BANNER_IMAGE");
        }

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error: any) {
      console.error(`Error in hsr-gameinfo (${subcommand}):`, error);
      await interaction.editReply({
        content: `An error occurred while fetching Honkai Star Rail ${subcommand} information. Please try again later. Details: ${error.message || "Unknown error"}`,
      });
    }
  },
};

export default HsrGameInfoCommand;
