"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../lib/api/users");
const helpers_1 = require("../lib/helpers");
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
        const response = await (0, helpers_1.addXp)(message, 11, 20);
        await users_1.usersService.messageCreate(message.author.id, message.author.username);
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
