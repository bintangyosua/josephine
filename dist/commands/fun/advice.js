"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fun_1 = require("../../lib/api/fun");
const AdviceCommand = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("advice")
        .setDescription("Replies with a random advice"),
    async execute(interaction) {
        const advice = await fun_1.funServices.getAdvice();
        interaction.reply(advice.slip.advice);
    },
};
exports.default = AdviceCommand;
