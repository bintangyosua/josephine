"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const HelpCommand = {
    category: "ℹ️  Info",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all available commands by category"),
    async execute(interaction) {
        const client = interaction.client;
        const commandMap = new Map();
        const extendedClient = client;
        extendedClient.commands.forEach((cmd) => {
            if (!commandMap.has(cmd.category)) {
                commandMap.set(cmd.category, []);
            }
            commandMap.get(cmd.category)?.push(`/${cmd.data.name}`);
        });
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag,
        })
            .setDescription("Here are the available commands grouped by category:")
            .setColor(0x00ae86);
        for (let [category, cmds] of commandMap) {
            embed.addFields({
                name: category,
                value: cmds.map((cmd) => `\`${cmd}\``).join(", "),
                inline: true,
            });
        }
        await interaction.reply({ embeds: [embed] });
    },
};
exports.default = HelpCommand;
