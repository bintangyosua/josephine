"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opentdbService = void 0;
const axios_1 = __importDefault(require("axios"));
let token = "";
exports.opentdbService = {
    opentdbUrl: "https://opentdb.com/api.php",
    async getQuestion(amount, category, difficulty = "easy", type = "multiple") {
        const token = await this.ensureToken();
        const params = {
            amount,
            category,
            difficulty,
            type,
            token,
        };
        const response = await axios_1.default.get(this.opentdbUrl, { params });
        const code = response.data.response_code;
        // If token is invalid or empty, reset it and try again once
        if (code === 3 || code === 4) {
            this.setToken(""); // Reset token
            return this.getQuestion(amount, category, difficulty, type); // Retry once
        }
        return response.data;
    },
    getToken: () => token,
    setToken: (newToken) => {
        token = newToken;
    },
    async ensureToken() {
        if (this.getToken())
            return this.getToken();
        const res = await axios_1.default.get("https://opentdb.com/api_token.php?command=request");
        const newToken = res.data.token;
        this.setToken(newToken);
        return newToken;
    },
};
