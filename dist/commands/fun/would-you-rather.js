"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const would_you_rather_json_1 = __importDefault(require("../../data/would-you-rather.json"));
const WouldYouRatherCommand = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("would-you-rather")
        .setDescription("A fun game where the bot gives you two tough or funny choices, and you have to pick one!"),
    async execute(interaction) {
        const randomQuestion = would_you_rather_json_1.default[Math.floor(Math.random() * would_you_rather_json_1.default.length)];
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .addFields({ name: "Category", value: randomQuestion.category })
            .addFields({
            name: "Question",
            value: randomQuestion.question_content,
        })
            .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = WouldYouRatherCommand;
