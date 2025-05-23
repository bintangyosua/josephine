import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../../types/command";
import { starRailClient } from "../../lib/api/starrail";
import { colors } from "../../config";
import { CharacterData, Skill } from "starrail.js"; // For type hinting

// Helper function to generate rarity stars
const getRarityStars = (stars: number): string => "⭐".repeat(stars);

// Helper function to clean HTML tags from descriptions
const cleanDescription = (text: string): string => {
  return text.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n");
};

const HsrCharacterCommand: Command = {
  category: "🕹️ Game",
  data: new SlashCommandBuilder()
    .setName("hsr-character")
    .setDescription(
      "Fetches details for a specific Honkai Star Rail character."
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the Honkai Star Rail character.")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const characters = starRailClient.getAllCharacters();
    const choices = characters
      .map((char) => ({
        name: char.name.get("en") || `ID: ${char.id}`, // Fallback to ID if name not in English
        value: char.id.toString(), // Use ID as value for precise matching in execute
      }))
      .filter((choice) => choice.name.toLowerCase().includes(focusedValue))
      .slice(0, 25); // Discord limits choices to 25

    await interaction.respond(choices);
  },

  execute: async (interaction: ChatInputCommandInteraction) => {
    // The value from autocomplete will be the character ID
    const characterIdOrName = interaction.options.getString("name", true);
    await interaction.deferReply();

    let character: CharacterData | undefined;
    const allCharacters = starRailClient.getAllCharacters();

    // Try to find by ID first (if the value is numeric, from autocomplete)
    if (!isNaN(Number(characterIdOrName))) {
      character = allCharacters.find(
        (char) => char.id.toString() === characterIdOrName
      );
    }

    // If not found by ID (e.g., user typed full name without selecting from autocomplete)
    if (!character) {
      character = allCharacters.find(
        (char) =>
          char.name.get("en")?.toLowerCase() === characterIdOrName.toLowerCase()
      );
    }

    if (!character) {
      await interaction.editReply({
        content: `Character "${characterIdOrName}" not found. Please check the name or select from the autocomplete suggestions.`,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(character.name.get("en") || "Unknown Character")
      .setColor(character.combatType.color || colors.primary || "#0099ff")
      .setThumbnail(character.icon.url) // Smaller icon for thumbnail
      .setImage(character.splashImage.url); // Larger splash art

    embed.addFields(
      {
        name: "Rarity",
        value: getRarityStars(character.stars),
        inline: true,
      },
      {
        name: "Path",
        value: `${character.path.name.get("en") || "N/A"}`,
        inline: true,
      },
      {
        name: "Element (Combat Type)",
        value: `${character.combatType.name.get("en") || "N/A"}`,
        inline: true,
      }
    );

    const description = character.description.get("en");
    if (description) {
      embed.addFields({
        name: "Description",
        value:
          cleanDescription(description).substring(0, 1020) +
          (description.length > 1020 ? "..." : ""),
      });
    }

    // Skills
    if (character.skills && character.skills.length > 0) {
      character.skills.forEach((skill: Skill, index: number) => {
        // Only show first 3-4 skills to prevent embed overflow, or make it more selective
        if (index < 4) {
          const skillName = skill.name.get("en") || `Skill ${index + 1}`;
          const skillType = skill.skillType;
          let skillDesc = cleanDescription(
            skill._skillsData.map((s) => s.desc).join("\n")
          );
          if (skillDesc.length > 200) {
            // Keep skill descriptions concise
            skillDesc = skillDesc.substring(0, 197) + "...";
          }
          embed.addFields({
            name: `${skillName} (${skillType})`,
            value: skillDesc,
            inline: false,
          });
        }
      });
      if (character.skills.length > 4) {
        embed.addFields({
          name: "More Skills",
          value: "This character has more skills, not all are listed here.",
          inline: false,
        });
      }
    }

    embed.setFooter({
      text: `ID: ${character.id} | Path Icon: ${character.path.icon.url} | Element Icon: ${character.combatType.icon.url}`,
      iconURL: character.miniIcon.url, // Using miniIcon for footer if available
    });
    embed.setTimestamp();

    await interaction.editReply({ content: "" });
  },
};

export default HsrCharacterCommand;
