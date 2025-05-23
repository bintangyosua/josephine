import { Events, Message } from "discord.js";
import api from "../lib/axios";
import { usersService } from "../lib/api/users";
import { addXp } from "../lib/helpers";

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    // Validasi 1: Jangan tanggapi pesan dari bot
    if (message.author.bot) return;

    // Validasi 2: Pastikan pesan dari guild (server), bukan DM
    if (!message.guild) return;

    const response = await addXp(message, 11, 20);
    await usersService.messageCreate(
      message.author.id,
      message.author.username
    );

    if (response.status !== 200) return;

    if (response.data.currentLevel === response.data.newLevel) return;

    const channel = message.channel;
    if (channel && "send" in channel) {
      try {
        await channel.send(
          `Selamat <@${message.author.id}>, kamu berhasil naik ke level ${response.data.newLevel}.`
        );
      } catch (error) {
        console.error("Failed to send leveled up message.:", error);
      }
    }
  },
};
