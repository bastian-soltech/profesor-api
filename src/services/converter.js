import axios from "axios";
import fs from 'fs';
import FormData from "form-data";

const randomId = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === "x" ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

export async function convertFile(filePath, outputPath = "./output.mp3") {
  const randomUUID = randomId();
  const apiUrl = `https://s1.senseidownload.com/Api/V1/Process/ConvertFile/${randomUUID}`;
  const fileSize = fs.statSync(filePath).size;

  const form = new FormData();
  form.append("Fl", fileSize);
  form.append("F", fs.createReadStream(filePath));
  form.append("JS", "f-FWgp8L7NDvl7fL25v-iQ--");
  form.append("Pa", "/convert/mp4/to/mp3");
  form.append("S", "mp4");
  form.append("Ti", "31");
  form.append("Bi", "null");
  form.append("C", "en");
  form.append("A", "false");
  form.append("W", "1");
  form.append("U", "true");
  form.append("AudioBitrate", "0");
  form.append("key", "50a5eecb-8723-411b-b99e-27c187004abf");

  try {
    const res = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0",
        Origin: "https://fabconvert.com",
        Referer: "https://fabconvert.com",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const fileUrl = `https://s1.senseidownload.com/Api/V1${res.data.result.url}`;
    const downloadRes = await axios.get(fileUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(outputPath, downloadRes.data);
    return outputPath;
  } catch (err) {
    console.error("❌ Error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
}
