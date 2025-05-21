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
      await interaction.reply({
        content: "⚠️ There was an error executing this command.",
        ephemeral: true,
      });
    }
  },
};
