import axios from "axios";

export const githubServices = {
  getUser: async function (username: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching GitHub user ${username}:`, error);
      // It's better to let the command handle the error display
      // For example, by checking if the returned value is null or has an error property
      return null; 
    }
  },
};
