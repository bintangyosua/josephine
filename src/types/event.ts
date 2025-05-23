import { ClientEvents } from "discord.js";

interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (...args: any[]) => void | Promise<void>;
}
