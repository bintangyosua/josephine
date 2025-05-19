"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Confession = {
    category: "🎉 Fun",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("confession")
        .setDescription("Create confession anonymously")
        .addStringOption((option) => option.setName("message").setDescription("Message").setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString("message", true);
        const embed = new discord_js_1.EmbedBuilder().setDescription(`"${message}"`);
        await interaction.reply({
            content: `**Confession:**\n"${message}"`,
            ephemeral: true,
        });
        // Check if the channel supports the send method
        const channel = interaction.channel;
        if (channel && "send" in channel) {
            try {
                // await interaction.deleteReply();
                await channel.send({
                    content: `**Confession:**\n"${message}"`,
                });
            }
            catch (error) {
                console.error("Failed to send anonymous confession:", error);
            }
        }
    },
};
exports.default = Confession;
