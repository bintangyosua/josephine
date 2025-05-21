import fs from "fs";
import path from "path";
import { ExtendedClient } from "../client/extended-client";
import Table from "cli-table3";
import chalk from "chalk";

export async function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  const eventNames: { name: string; once: boolean }[] = [];

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)).default;

    // Simpan nama event dan tipe once/on
    eventNames.push({ name: event.name, once: event.once });

    if (event.once) {
      client.once(event.name, (...args: any[]) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
  }

  // Buat tabel dengan cli-table3
  const table = new Table({
    head: [
      chalk.blue.bold("Event Name"),
      chalk.green.bold("Type"),
      chalk.yellow.bold("Status"),
    ],
    colWidths: [30, 15, 10],
  });

  // Isi baris tabel
  eventNames.forEach(({ name, once }) => {
    table.push([
      chalk.cyan(name),
      once ? chalk.magenta("Once") : chalk.white("On"),
      chalk.green("Loaded"),
    ]);
  });

  console.log(chalk.bgBlueBright.black("\n📥 Loaded Events"));
  console.log(table.toString());
}
