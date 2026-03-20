import axios from 'axios';
import FormData from 'form-data';

export async function removeBg(fileUpload) {
  try {
    const form = new FormData();
    form.append("file", fileUpload);

    const { data } = await axios.post("https://removebg.one/api/predict/v2", form, {
      headers: {
        ...form.getHeaders(),
        "accept": "application/json, text/plain, */*",
        "Referer": "https://removebg.one/upload"
      }
    });
    return data;
  } catch (e) {
    console.error("❌ Gagal:", e.message);
    return null;
  }
}
