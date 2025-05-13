"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        logger_1.logger.info(`🤖 Logged in as ${client.user?.tag}`);
    },
};
