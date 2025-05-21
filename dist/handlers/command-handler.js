"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = loadCommands;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const logger_1 = require("../utils/logger");
async function loadCommands(client) {
    const commands = [];
    const commandFolders = fs_1.default.readdirSync(path_1.default.join(__dirname, "..", "commands"));
    for (const folder of commandFolders) {
        const folderPath = path_1.default.join(__dirname, "..", "commands", folder);
        const commandFiles = fs_1.default
            .readdirSync(folderPath)
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of commandFiles) {
            const commandPath = path_1.default.join(folderPath, file);
            const command = (await Promise.resolve(`${commandPath}`).then(s => __importStar(require(s)))).default;
            client.commands.set(command.data.name, command);
            commands.push(command);
        }
    }
    // 🔵 Create a CLI table
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.blue("Category"),
            chalk_1.default.green("Command"),
            chalk_1.default.yellow("Description"),
        ],
        colWidths: [20, 20, 50],
        wordWrap: true,
    });
    commands.forEach((cmd) => {
        table.push([
            chalk_1.default.cyan(cmd.category),
            chalk_1.default.green(`/${cmd.data.name}`),
            chalk_1.default.white(cmd.data.description || "-"),
        ]);
    });
    console.log(chalk_1.default.bgRedBright.black("\n📦 Loaded Commands:"));
    console.log(table.toString());
    const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.DISCORD_BOT_TOKEN);
    try {
        logger_1.logger.info("Registering slash commands...");
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.DISCORD_CLIENT_ID), {
            body: commands.map((cmd) => cmd.data.toJSON()),
        });
        logger_1.logger.info("Slash commands registered!");
    }
    catch (err) {
        console.error("❌ Failed to register commands:", err);
    }
}
