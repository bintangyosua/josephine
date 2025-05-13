import { REST, Routes } from "discord.js";
import path from "path";
import fs from "fs";
import { ExtendedClient } from "../client/extended-client";
import { Command } from "../types/command";
import { config } from "../config";

export async function loadCommands(client: ExtendedClient) {
  const commands: Command[] = [];

  const commandFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));

  for (const folder of commandFolders) {
    const folderPath = path.join(__dirname, "..", "commands", folder);

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandPath = path.join(folderPath, file);
      const command: Command = (await import(commandPath)).default;
      client.commands.set(command.data.name, command);
      commands.push(command);
    }
  }

  const rest = new REST({ version: "10" }).setToken(config.DISCORD_BOT_TOKEN);

  console.log("📦 Loaded commands:");
  commands.forEach((cmd) => {
    console.log(
      `- [${cmd.category}] /${cmd.data.name} → ${cmd.data.description}`
    );
  });

  try {
    console.log("🔄 Registering slash commands...");
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    });
    console.log("✅ Slash commands registered!");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
}
