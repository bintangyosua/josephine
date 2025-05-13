import { Events } from "discord.js";
import { ExtendedClient } from "../client/extended-client";
import { logger } from "../utils/logger";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    logger.info(`🤖 Logged in as ${client.user?.tag}`);
  },
};
