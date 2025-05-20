import axios from "axios";

// export const API_URL = "http://localhost:2222";

export const API_URL = "https://project-abb-vwxt.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
