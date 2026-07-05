import axios from "axios";
import { auth } from "../firebase.js";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://jansahayak-bharat.onrender.com/api",
});

// Attach the current user's Firebase ID token automatically
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
