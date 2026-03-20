import axios from 'axios';

export class RecapioClient {
  constructor(videoUrl) {
    this.videoUrl = videoUrl;
    this.videoId = this.extractVideoId(videoUrl);
    this.fingerprint = btoa(Date.now().toString());
    this.baseUrl = "https://api.recapio.com";
    this.headers = {
      authority: "api.recapio.com",
      origin: "https://recapio.com",
      referer: "https://recapio.com/",
      "user-agent": "Mozilla/5.0",
      "x-app-language": "en",
      "x-device-fingerprint": this.fingerprint,
    };
  }

  extractVideoId(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  }

  async initiate() {
    try {
      const res = await axios.post(`${this.baseUrl}/youtube-chat/initiate`, { url: this.videoUrl }, { headers: this.headers });
      return res.data;
    } catch (e) {
      throw e?.response?.data.error || e;
    }
  }

  async checkStatus(slug) {
    try {
      const res = await axios.get(`${this.baseUrl}/youtube-chat/status/by-slug/${slug}`, {
        params: { fingerprint: this.fingerprint },
        headers: this.headers,
      });
      if (res.data?.transcript) res.data.transcript = JSON.parse(res.data.transcript);
      return res.data;
    } catch (e) {
      throw e?.response?.data.error || e;
    }
  }

  async start() {
    const init = await this.initiate();
    const status = await this.checkStatus(init.slug);
    return { info: init, slug_ai: status };
  }

  async sendMessage(prompt) {
    const res = await axios.post(`${this.baseUrl}/youtube-chat/message`, {
      message: prompt,
      video_id: this.videoId,
      fingerprint: this.fingerprint,
    }, {
      headers: { ...this.headers, accept: "text/event-stream", "content-type": "application/json" },
      responseType: "text",
    });

    return res.data.split("\n")
      .filter(line => line.startsWith("data:"))
      .map(line => {
        try { return JSON.parse(line.slice(5).trim()).chunk || ""; } catch (e) { return ""; }
      }).join("");
  }
}
