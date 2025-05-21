import { config } from "../config/env";
import axios from "axios";

const api = axios.create({
  baseURL: `${config.API_URL}/api`,
});

export default api;
