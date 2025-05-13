import axios from "axios";

export const wikiServices = {
  getBookByName: async (name: string) => {
    const response = await axios.get(
      "https://openlibrary.org/search.json?q=" + name
    );
    return response.data;
  },
};
