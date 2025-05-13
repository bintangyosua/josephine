import fs from "fs";
import path from "path";
import { ExtendedClient } from "../client/extended-client";
import { ClientEvents } from "discord.js";

export async function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)).default;

    if (event.once) {
      client.once(event.name, (...args: any[]) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
  }
}
