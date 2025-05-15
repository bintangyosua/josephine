import axios from "axios";

let token = "";

export const opentdbService = {
  opentdbUrl: "https://opentdb.com/api.php",

  async getQuestion(
    amount: number,
    category: number,
    difficulty: "easy" | "medium" | "hard" = "easy",
    type: "multiple" | "boolean" = "multiple"
  ): Promise<any> {
    const token = await this.ensureToken();

    const params = {
      amount,
      category,
      difficulty,
      type,
      token,
    };

    const response = await axios.get(this.opentdbUrl, { params });

    const code = response.data.response_code;

    // If token is invalid or empty, reset it and try again once
    if (code === 3 || code === 4) {
      this.setToken(""); // Reset token
      return this.getQuestion(amount, category, difficulty, type); // Retry once
    }

    return response.data;
  },

  getToken: () => token,

  setToken: (newToken: string) => {
    token = newToken;
  },

  async ensureToken() {
    if (this.getToken()) return this.getToken();

    const res = await axios.get(
      "https://opentdb.com/api_token.php?command=request"
    );

    const newToken = res.data.token;
    this.setToken(newToken);
    return newToken;
  },
};
