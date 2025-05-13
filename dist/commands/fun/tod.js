"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const truth_or_dare_json_1 = __importDefault(require("../../data/truth-or-dare.json"));
const WouldYouRatherCommand = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("tod")
        .setDescription("Start a fun game where you get a random truth question or dare challenge!")
        .addSubcommand((subcommand) => subcommand
        .setName("truth")
        .setDescription("Get a random truth question.")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("Target user")
        .setRequired(false)))
        .addSubcommand((subcommand) => subcommand
        .setName("dare")
        .setDescription("Get a random dare challenge.")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("Target user")
        .setRequired(false))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getUser("target");
        // Filter pertanyaan berdasarkan kategori
        const filteredQuestions = truth_or_dare_json_1.default.filter((item) => item.category.toLowerCase() === subcommand.toLowerCase());
        // Cek apakah ada pertanyaan dalam kategori tersebut
        if (filteredQuestions.length === 0) {
            await interaction.reply({
                content: `No ${subcommand} questions found.`,
                ephemeral: true,
            });
            return;
        }
        // Ambil pertanyaan acak
        const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
        // Buat embed
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
            .setColor(subcommand === "truth" ? 0x00bfff : 0xff4500)
            .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL(),
        });
        // Buat mention message jika ada target
        const mentionMessage = target
            ? `🎯 <@${target.id}>, kamu dapat **${subcommand}** dari <@${interaction.user.id}>!`
            : undefined;
        // Kirim dalam satu `reply`
        await interaction.reply({
            content: mentionMessage,
            embeds: [embed],
        });
    },
};
exports.default = WouldYouRatherCommand;
