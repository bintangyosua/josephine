"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
const users_1 = require("../lib/api/users");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        logger_1.logger.info(`Command "/${interaction.commandName}" executed by ${interaction.user.tag} (${interaction.user.id})`);
        try {
            await command.execute(interaction);
            if (interaction.guild?.id) {
                if (command.data.name !== "profile") {
                    const xp = Math.floor(Math.random() * 11) + 20;
                    await users_1.usersService.addXp(interaction.user.id, xp);
                }
            }
            logger_1.logger.info(`✅ Success executing command "/${interaction.commandName}"`);
        }
        catch (err) {
            console.error(`❌ Error executing command ${interaction.commandName}:`, err);
            await interaction.reply({
                content: "⚠️ There was an error executing this command.",
                ephemeral: true,
            });
        }
    },
};
