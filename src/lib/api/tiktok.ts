import axios from "axios";

export const tiktokService = {
  tiktokUrl: "https://open.tiktokapis.com/",
  getVideosByQuery: async function () {
    const response = await axios.get(`${this.tiktokUrl}/v2/video/list/`, {
      headers: {
        Authorization: `Bearer`,
        "Content-Type": "application/json",
      },
    });
  },
};
