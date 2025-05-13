"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.funServices = void 0;
const axios_1 = __importDefault(require("axios"));
exports.funServices = {
    getMeme: async function () {
        const response = await axios_1.default.get("https://meme-api.com/gimme");
        return response.data;
    },
    getAdvice: async function () {
        const response = await axios_1.default.get("https://api.adviceslip.com/advice");
        return response.data;
    },
    getTrivia: async function () {
        const response = await axios_1.default.get("https://opentdb.com/api.php?amount=1&type=multiple");
        return response.data;
    },
    getWaifu: async function () {
        const response = await axios_1.default.get("https://api.waifu.pics/sfw/waifu");
        return response.data;
    },
};
