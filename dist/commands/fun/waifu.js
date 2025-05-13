"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fun_1 = require("../../lib/api/fun");
const Meme = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("waifu")
        .setDescription("Replies with a random waifu"),
    async execute(interaction) {
        const waifu = await fun_1.funServices.getWaifu();
        const embed = new discord_js_1.EmbedBuilder().setImage(waifu.url);
        interaction.reply({ embeds: [embed] });
    },
};
exports.default = Meme;
