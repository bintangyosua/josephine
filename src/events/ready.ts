import { ActivityType, Events } from "discord.js";
import { ExtendedClient } from "../client/extended-client";
import { logger } from "../utils/logger";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    logger.info(`🤖 Logged in as ${client.user?.tag}`);

    client.user?.setStatus("dnd");

    const activities = [
      { name: "Netflix and chill", type: ActivityType.Playing },
      { name: "Coding with coffee", type: ActivityType.Listening },
      { name: "YouTube drama", type: ActivityType.Watching },
      {
        name: "Valorant live",
        type: ActivityType.Streaming,
        url: "https://twitch.tv/yourchannel",
      },
      { name: "Hackathon mode", type: ActivityType.Competing },
    ];

    let index = 0;

    setInterval(() => {
      const activity = activities[index];
      client.user?.setActivity(activity.name, {
        type: activity.type,
        url: activity.url ? activity.url : undefined,
      });
      index = (index + 1) % activities.length;
    }, 1_000); // ganti setiap 10 detik
  },
};
