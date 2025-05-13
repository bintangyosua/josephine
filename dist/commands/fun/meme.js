"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fun_1 = require("../../lib/api/fun");
const Meme = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("meme")
        .setDescription("Replies with a random meme"),
    async execute(interaction) {
        const meme = await fun_1.funServices.getMeme();
        interaction.reply(meme.url);
    },
};
exports.default = Meme;
