// frontend/src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export const sendMessage = async (message) => {
  const { data } = await apiClient.post("/api/ask", { message });
  return data.reply;
};

export default apiClient;