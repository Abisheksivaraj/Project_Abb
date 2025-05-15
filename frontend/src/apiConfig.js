import axios from "axios";

export const API_URL = "https://project-abb-backend.onrender.com";

// export const API_URL = "https://fairwayenterprises.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
