"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const PingCommand = {
    category: "⚙️  Utility",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check bot latency"),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`);
    },
};
exports.default = PingCommand;
