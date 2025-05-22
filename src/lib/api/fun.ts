import axios from "axios";

export const funServices = {
  getMeme: async function () {
    const response = await axios.get("https://meme-api.com/gimme");
    return response.data;
  },

  getAdvice: async function () {
    const response = await axios.get("https://api.adviceslip.com/advice");
    return response.data;
  },

  getTrivia: async function () {
    const response = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    return response.data;
  },

  getWaifu: async function () {
    const response = await axios.get("https://api.waifu.pics/sfw/waifu");
    return response.data;
  },

  getDadJoke: async function () {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.joke;
  },

  getRandomFact: async function () {
    const response = await axios.get(
      "https://uselessfacts.jsph.pl/random.json?language=en"
    );
    return response.data.text;
  },
};
