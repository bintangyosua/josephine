import { REST, Routes } from "discord.js";
import path from "path";
import fs from "fs";
import { ExtendedClient } from "../client/extended-client";
import { Command } from "../types/command";
import { config } from "../config";
import chalk from "chalk";
import CliTable3 from "cli-table3";
import { logger } from "../utils/logger";
import { commandService } from "../lib/api/command";

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

  // 🔵 Create a CLI table
  const table = new CliTable3({
    head: [
      chalk.blue("Category"),
      chalk.green("Command"),
      chalk.yellow("Description"),
    ],
    colWidths: [20, 20, 50],
    wordWrap: true,
  });

  commands.forEach(async (cmd) => {
    table.push([
      chalk.cyan(cmd.category),
      chalk.green(`/${cmd.data.name}`),
      chalk.white(cmd.data.description || "-"),
    ]);

    await commandService.create({
      name: cmd.data.name,
      category: cmd.category,
      description: cmd.data.description || "-",
    });
  });

  console.log(chalk.bgRedBright.black("\n📦 Loaded Commands:"));
  console.log(table.toString());

  const rest = new REST({ version: "10" }).setToken(config.DISCORD_BOT_TOKEN);

  try {
    logger.info("Registering slash commands...");
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    });
    logger.info("Slash commands registered!");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
}
