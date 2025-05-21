"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        logger_1.logger.info(`🤖 Logged in as ${client.user?.tag}`);
        const activities = [
            { name: "Netflix and chill", type: discord_js_1.ActivityType.Playing },
            { name: "Coding with coffee", type: discord_js_1.ActivityType.Listening },
            { name: "YouTube drama", type: discord_js_1.ActivityType.Watching },
            {
                name: "Valorant live",
                type: discord_js_1.ActivityType.Streaming,
                url: "https://twitch.tv/yourchannel",
            },
            { name: "Hackathon mode", type: discord_js_1.ActivityType.Competing },
        ];
        let index = 0;
        setInterval(() => {
            const activity = activities[index];
            client.user?.setActivity(activity.name, { type: activity.type });
            index = (index + 1) % activities.length;
        }, 1000); // ganti setiap 10 detik
    },
};
