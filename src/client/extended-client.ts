import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "../types/command";

export class ExtendedClient extends Client {
  public commands = new Collection<string, Command>();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }
}
