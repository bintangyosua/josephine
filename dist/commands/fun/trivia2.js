"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const opentdb_1 = require("../../lib/api/opentdb");
const helpers_1 = require("../../lib/helpers");
const he_1 = __importDefault(require("he"));
const Trivia2 = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("trivia2")
        .setDescription("Random Trivia")
        .addSubcommand((option) => option.setName("anime").setDescription("Anime"))
        .addSubcommand((option) => option.setName("game").setDescription("Game"))
        .addSubcommand((option) => option.setName("movie").setDescription("Movie"))
        .addSubcommand((option) => option.setName("politics").setDescription("Politics"))
        .addSubcommand((option) => option.setName("history").setDescription("History")),
    async execute(interaction) {
        const category = interaction.options.getSubcommand();
        let categoryId;
        switch (category) {
            case "anime":
                categoryId = 31;
                break;
            case "game":
                categoryId = 15;
                break;
            case "movie":
                categoryId = 11;
                break;
            case "politics":
                categoryId = 24;
                break;
            case "history":
                categoryId = 23;
                break;
            default:
                categoryId = 9;
                break;
        }
        const level = ["easy", "medium", "hard"][Math.floor(Math.random() * 3)];
        const response = await opentdb_1.opentdbService.getQuestion(1, categoryId, level, "multiple");
        const trivia = response.results[0];
        const question = he_1.default.decode(trivia.question);
        const correct = he_1.default.decode(trivia.correct_answer);
        const options = [...trivia.incorrect_answers.map(he_1.default.decode), correct].sort(() => Math.random() - 0.5);
        const buttons = options.map((opt) => new discord_js_1.ButtonBuilder()
            .setCustomId(opt)
            .setLabel(opt)
            .setStyle(discord_js_1.ButtonStyle.Primary));
        const row = new discord_js_1.ActionRowBuilder().addComponents(buttons);
        await interaction.reply({
            content: `🧠 **${(0, helpers_1.capitalize)(category)} Trivia:**\nDifficulty: ${(0, helpers_1.capitalize)(level)}\n\n ${question}\n`,
            components: [row],
        });
        const collector = interaction.channel?.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 15000,
        });
        let answered = false;
        collector?.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: "Ini bukan pertanyaan kamu!",
                    ephemeral: true,
                });
            }
            const selected = i.customId;
            answered = true;
            collector.stop();
            const feedback = options
                .map((opt) => {
                const isCorrect = opt === correct;
                const isChosen = opt === selected;
                const left = isChosen ? (isCorrect ? "🎯" : "❌") : "▫️";
                const right = isCorrect ? "✅" : "";
                return `${left} ${opt} ${right}`;
            })
                .join("\n");
            const result = selected === correct
                ? "🎉 Jawaban kamu **benar**!"
                : `😔 Jawaban kamu **salah**. Jawaban yang benar adalah **${correct}**.`;
            await i.update({
                content: `🧠 **${(0, helpers_1.capitalize)(category)} Trivia:**\nDifficulty: ${(0, helpers_1.capitalize)(level)}\n\n ${question}\n\n${feedback}\n\n${result}`,
                components: [],
            });
            return;
        });
        collector?.on("end", async (_, reason) => {
            if (answered)
                return;
            try {
                const disabledButtons = options.map((opt) => new discord_js_1.ButtonBuilder()
                    .setCustomId(opt)
                    .setLabel(opt)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setDisabled(true));
                const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(disabledButtons);
                await interaction.editReply({
                    content: `🧠 **${(0, helpers_1.capitalize)(category)} Trivia:**\nDifficulty: ${(0, helpers_1.capitalize)(level)}\n\n${question}\n\n⏰ Waktu habis! Kamu tidak menjawab tepat waktu.`,
                    components: [disabledRow],
                });
            }
            catch (error) {
                console.error("Gagal edit karena interaksi tidak valid lagi:", error);
            }
        });
    },
};
exports.default = Trivia2;
