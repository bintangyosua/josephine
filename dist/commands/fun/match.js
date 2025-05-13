"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const crypto_1 = __importDefault(require("crypto"));
function consistentHash(name1, name2) {
    const n1 = name1.toLowerCase();
    const n2 = name2.toLowerCase();
    const hash1 = crypto_1.default
        .createHash("sha256")
        .update(n1 + n2)
        .digest("hex");
    const hash2 = crypto_1.default
        .createHash("sha256")
        .update(n2 + n1)
        .digest("hex");
    const combinedHash = hash1.slice(0, 4) + hash2.slice(0, 4);
    const score = parseInt(combinedHash, 16) % 101;
    return score;
}
function xorHashScore(name1, name2) {
    const n1 = name1.toLowerCase();
    const n2 = name2.toLowerCase();
    let total = 0;
    const maxLen = Math.max(n1.length, n2.length);
    for (let i = 0; i < maxLen; i++) {
        const c1 = n1.charCodeAt(i) || 0;
        const c2 = n2.charCodeAt(i) || 0;
        total += c1 ^ c2;
    }
    return (total + 45) % 101; // tambah boost 30%, looping kalau lebih dari 100
}
function getMessage(score) {
    if (score > 80)
        return "🔥 Kalian cocok banget!";
    if (score > 60)
        return "💖 Lumayan cocok nih!";
    if (score > 40)
        return "🙂 Biasa aja sih...";
    if (score > 20)
        return "😅 Kurang cocok kayaknya...";
    return "💔 Aduh, jangan dipaksain deh...";
}
const MatchCommand = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("match")
        .setDescription("Compatibility of a name with another name")
        .addStringOption((option) => option
        .setName("first-name")
        .setDescription("First name")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("second-name")
        .setDescription("First name")
        .setRequired(true)),
    async execute(interaction) {
        const name1 = interaction.options.getString("first-name", true);
        const name2 = interaction.options.getString("second-name", true);
        const score = xorHashScore(name1, name2);
        const message = getMessage(score);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`💘 Match Result`)
            .setDescription(`**${name1}** ❤️ **${name2}** = **${score}%**\n${message}`)
            .setColor(0xff69b4)
            .setFooter({ text: "Made with love 💕" });
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = MatchCommand;
