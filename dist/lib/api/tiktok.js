"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokService = void 0;
const axios_1 = __importDefault(require("axios"));
exports.tiktokService = {
    tiktokUrl: "https://open.tiktokapis.com/",
    getVideosByQuery: async function () {
        const response = await axios_1.default.get(`${this.tiktokUrl}/v2/video/list/`, {
            headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
            },
        });
    },
};
