import * as dotenv from "dotenv";
import { ExtendedClient } from "./client/extended-client";
import { loadCommands } from "./handlers/command-handler";
import { loadEvents } from "./handlers/event-handler";
import { config as app_config } from "./config";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new ExtendedClient();

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(app_config.DISCORD_BOT_TOKEN);
})();
