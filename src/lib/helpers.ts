import { Message } from "discord.js";
import { usersService } from "./api/users";

export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function addXp(
  message: Message<boolean>,
  left: number,
  right: number
) {
  const xp = Math.floor(Math.random() * left) + right;
  const response = await usersService.addXp(
    message.author.id,
    message.author.username,
    xp
  );
  return response;
}
