import fs from "fs";
import path from "path";
import { ExtendedClient } from "../client/extended-client";

export async function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  const eventNames: string[] = [];

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)).default;

    // Simpan nama event untuk print nanti
    eventNames.push(event.name);

    if (event.once) {
      client.once(event.name, (...args: any[]) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
  }

  // Print nama-nama event yang berhasil di-load
  console.log("📥 Loaded Events:");
  eventNames.forEach((name) => console.log(`- ${name}`));
}
