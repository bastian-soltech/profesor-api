import axios from "axios";

export async function getMelodyMetadata(query) {
  try {
    const { data } = await axios.get(`https://melodyinbox.com/r.php?q=${encodeURIComponent(query)}`);
    return data;
  } catch (error) {
    console.error("❌ Melody Error:", error.message);
    throw error;
  }
}

export async function melodyAuth() {
  const { data } = await axios.post('https://v5-n01.yt2api.com/api/v5/auth', {}, {
    headers: { 'Content-Type': 'application/json' }
  });
  return data;
}
