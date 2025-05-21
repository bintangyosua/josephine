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
exports.loadEvents = loadEvents;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
async function loadEvents(client) {
    const eventsPath = path_1.default.join(__dirname, "..", "events");
    const eventFiles = fs_1.default
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    const eventNames = [];
    for (const file of eventFiles) {
        const filePath = path_1.default.join(eventsPath, file);
        const event = (await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default;
        // Simpan nama event dan tipe once/on
        eventNames.push({ name: event.name, once: event.once });
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
    // Buat tabel dengan cli-table3
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.blue.bold("Event Name"),
            chalk_1.default.green.bold("Type"),
            chalk_1.default.yellow.bold("Status"),
        ],
        colWidths: [30, 15, 10],
    });
    // Isi baris tabel
    eventNames.forEach(({ name, once }) => {
        table.push([
            chalk_1.default.cyan(name),
            once ? chalk_1.default.magenta("Once") : chalk_1.default.white("On"),
            chalk_1.default.green("Loaded"),
        ]);
    });
    console.log(chalk_1.default.bgBlueBright.black("\n📥 Loaded Events"));
    console.log(table.toString());
}
