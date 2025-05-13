"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fun_1 = require("../../lib/api/fun");
const Trivia = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Replies with a random trivia"),
    async execute(interaction) {
        // Ambil data trivia dari API
        const data = await fun_1.funServices.getTrivia();
        const trivia = data.results[0];
        const question = decodeHTML(trivia.question);
        const correct = decodeHTML(trivia.correct_answer);
        const options = [...trivia.incorrect_answers.map(decodeHTML), correct].sort(() => Math.random() - 0.5);
        const buttons = options.map((opt) => new discord_js_1.ButtonBuilder()
            .setCustomId(opt)
            .setLabel(opt)
            .setStyle(discord_js_1.ButtonStyle.Primary));
        const row = new discord_js_1.ActionRowBuilder().addComponents(buttons);
        await interaction.reply({
            content: `🧠 **Trivia:** ${question}`,
            components: [row],
        });
        const collector = interaction.channel?.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 15000,
            max: 1,
        });
        collector?.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: "Ini bukan pertanyaan kamu!",
                    ephemeral: true,
                });
            }
            const selectedLabel = i.customId;
            const optionText = options
                .map((opt) => {
                const isCorrect = opt === correct;
                const isChosen = opt === selectedLabel;
                const left = isChosen ? "❌" : "▫️";
                const right = isCorrect ? "✅" : "";
                return `${left} ${opt} ${right}`;
            })
                .join("\n");
            const resultText = selectedLabel === correct
                ? "🎉 Jawaban kamu **benar**!"
                : `😔 Jawaban kamu **salah**.`;
            await i.update({
                content: `🧠 **Trivia:** ${question}\n\n${optionText}\n\n${resultText}`,
                components: [],
            });
        });
    },
};
exports.default = Trivia;
// Fungsi untuk decode HTML entity (&quot;, &#039;, etc.)
function decodeHTML(html) {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&eacute;/g, "é");
}
