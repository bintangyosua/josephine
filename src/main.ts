import * as dotenv from "dotenv";
import { ExtendedClient } from "./client/extended-client";
import { loadCommands } from "./handlers/command-handler";
import { Events } from "discord.js";
import { config as app_config } from "./config";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new ExtendedClient();

client.once(Events.ClientReady, async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
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
});

(async () => {
  await loadCommands(client);
  client.login(app_config.DISCORD_BOT_TOKEN);
})();
