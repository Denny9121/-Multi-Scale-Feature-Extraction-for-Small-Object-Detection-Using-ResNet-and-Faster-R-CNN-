import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const predictImage = async ({ file, base64, signal }) => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (!file && base64) formData.append("image", base64);

  const response = await axios.post(`${API_BASE}/predict`, formData, {
    signal,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
