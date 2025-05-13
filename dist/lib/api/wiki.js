"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiServices = void 0;
const axios_1 = __importDefault(require("axios"));
exports.wikiServices = {
    getBookByName: async (name) => {
        const response = await axios_1.default.get("https://openlibrary.org/search.json?q=" + name);
        return response.data;
    },
};
