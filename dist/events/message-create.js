"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../lib/api/users");
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    async execute(message) {
        // Validasi 1: Jangan tanggapi pesan dari bot
        if (message.author.bot)
            return;
        // Validasi 2: Pastikan pesan dari guild (server), bukan DM
        if (!message.guild)
            return;
        const xp = Math.floor(Math.random() * 11) + 20;
        const response = await users_1.usersService.addXp(message.author.id, xp);
        await users_1.usersService.messageCreate(message.author.id);
        if (response.status !== 200)
            return;
        if (response.data.currentLevel === response.data.newLevel)
            return;
        const channel = message.channel;
        if (channel && "send" in channel) {
            try {
                await channel.send(`Selamat <@${message.author.id}>, kamu berhasil naik ke level ${response.data.newLevel}.`);
            }
            catch (error) {
                console.error("Failed to send leveled up message.:", error);
            }
        }
    },
};
