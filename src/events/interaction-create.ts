import { Events, Interaction } from "discord.js";
import { ExtendedClient } from "../client/extended-client";
import { logger } from "../utils/logger";
import { usersService } from "../lib/api/users";

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: ExtendedClient) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    logger.info(
      `Command "/${interaction.commandName}" executed by ${interaction.user.tag} (${interaction.user.id})`
    );

    try {
      await command.execute(interaction);

      logger.info(`✅ Success executing command "/${interaction.commandName}"`);
    } catch (err) {
      console.error(
        `❌ Error executing command ${interaction.commandName}:`,
        err
      );
      
      const errorMessage = {
        content: "⚠️ There was an error executing this command.",
        flags: 64, // MessageFlags.Ephemeral
      };
      
      // Check if interaction was already replied to or deferred
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};
