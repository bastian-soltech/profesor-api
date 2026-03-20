import axios from "axios";
import fs from "fs";

export default class AudioTranscriber {
  constructor(debug = false) {
    this.debug = debug;
    this.cookies = {};
    this.cookieHeader = "";
    this.transcriptionId = null;
    this.audioInfo = null;
  }

  async initSession() {
    const response = await axios.get("https://audio.com/transcription", {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
    });

    const rawCookies = response.headers["set-cookie"] || [];
    this.cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
    this.cookies = Object.fromEntries(
      this.cookieHeader.split("; ").map((c) => {
        const [name, value] = c.split("=");
        return [name, decodeURIComponent(value)];
      })
    );
  }

  getAnalyticsHeader() {
    return JSON.stringify({
      device_id: this.cookies["device-id"],
      session_id: this.cookies["session-id"],
      member_experiment_id: this.cookies["experiment_member_id"],
    });
  }

  async requestUpload(fileName, fileBuffer) {
    this.fileName = fileName;
    this.fileBuffer = fileBuffer;
    const response = await axios.post(
      "https://api.audio.com/audio",
      {
        mime: "audio/mpeg",
        name: this.fileName,
        size: this.fileBuffer.length,
        category: 7,
        downloadable: false,
        options: { transcribe: true },
        method: "PUT",
      },
      {
        headers: {
          "content-type": "application/json",
          "x-analytics-context": this.getAnalyticsHeader(),
        },
      }
    );

    this.audioInfo = response.data;
    this.transcriptionId = response.data.extra.audio.id;
    return response.data;
  }

  async uploadFile() {
    await axios.put(this.audioInfo.url, this.fileBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": this.fileBuffer.length,
      },
      maxBodyLength: Infinity,
    });
  }

  async notifyUploadSuccess() {
    await axios.post(this.audioInfo.success, {});
  }

  async checkTranscriptionStatus() {
    const response = await axios.get("https://api.audio.com/audio", {
      params: { id: this.transcriptionId },
      headers: {
        "x-analytics-context": this.getAnalyticsHeader(),
      },
    });
    return response.data[0]?.transcribed;
  }

  async getTranscriptionText() {
    const response = await axios.get(
      `https://api.audio.com/audio/${this.transcriptionId}/transcription`,
      {
        headers: {
          "x-analytics-context": this.getAnalyticsHeader(),
        },
      }
    );
    return response.data;
  }

  async transcribe(filePath, intervalMs = 5000) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split("/").pop();
    
    await this.initSession();
    await this.requestUpload(fileName, fileBuffer);
    await this.uploadFile();
    await this.notifyUploadSuccess();

    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        try {
          const done = await this.checkTranscriptionStatus();
          if (done) {
            const result = await this.getTranscriptionText();
            clearInterval(poll);
            resolve(result);
          }
        } catch (err) {
          clearInterval(poll);
          reject(err);
        }
      }, intervalMs);
    });
  }
}
