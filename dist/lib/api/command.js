"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandService = void 0;
const axios_1 = __importDefault(require("../axios"));
exports.commandService = {
    create: async (command) => {
        const response = await axios_1.default.post("/commands", command);
        return response;
    },
};
