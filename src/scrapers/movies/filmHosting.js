import * as cheerio from 'cheerio';
import axios from 'axios';
import FormData from 'form-data';

export class hostingHola {
  constructor() {
    this.baseUrl = "https://hostingaloha.com/";
  }

  async init() {
    try {
      const res = await fetch(this.baseUrl, { redirect: "follow" });
      if (res.ok) {
        const finalUrl = new URL(res.url);
        this.baseUrl = `${finalUrl.origin}/`;
      }
    } catch (err) {
      console.error("❌ Gagal mendeteksi domain aktif:", err.message);
    }
  }

  async getIndoMovies(page = 1) {
    await this.init();
    const response = await fetch(`${this.baseUrl}country/indonesia/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const data = [];

    $("article.item").each((i, el) => {
      const title = $(el).find("h2.entry-title").text().trim();
      const linkStream = $(el).find("a").attr("href");
      const poster = $(el).find("img").attr("src");
      const rating = $(el).find("div.gmr-rating-item").text().trim();
      const duration = $(el).find("div.gmr-duration-item").text().trim();
      let slug = linkStream.replace(this.baseUrl, "").replace(/^\/|\/$/g, "");
      let type = slug.includes("tv") ? "TV-Shows" : "Movies";
      if (type === "TV-Shows") slug = slug.replace("tv/", "");

      data.push({ title, linkStream, poster, rating, duration, slug, type, encodeurl: Buffer.from(linkStream).toString('base64') });
    });

    return data;
  }

  async ajaxMovieRequest(postId, player) {
    const formData = new FormData();
    formData.append("action", "muvipro_player_content");
    formData.append("post_id", postId);
    formData.append("tab", player);

    try {
      const { data: html } = await axios.post(`${this.baseUrl}/wp-admin/admin-ajax.php`, formData, {
        headers: { ...formData.getHeaders(), "User-Agent": "Mozilla/5.0" },
        timeout: 15000,
      });
      const $ = cheerio.load(html);
      return $("iframe").attr("src") || null;
    } catch (err) {
      console.error("❌ Gagal memuat player:", err.message);
      return null;
    }
  }

  async getStreaming(slug = "", url, type = "Movies", player = "p2") {
    await this.init();
    const targetUrl = url || `${this.baseUrl}${slug}`;
    const response = await fetch(targetUrl, { redirect: "follow" });
    const html = await response.text();
    const $ = cheerio.load(html);

    if (type === "TV-Shows") {
      const episodes = $('div.gmr-listseries > a').map((i, el) => ({
        episodeTitle: $(el).text().trim(),
        episodeLink: $(el).attr('href')
      })).get();
      return { listSeriesLink: episodes };
    }

    const idMovie = $('div#muvipro_player_content_id').attr('data-id');
    const StreamingUrl = await this.ajaxMovieRequest(idMovie, player);

    return {
      idMovie, StreamingUrl,
      title: $("h1.entry-title").text().trim(),
      description: $(".entry-content p").first().text().trim(),
      rating: $(".gmr-meta-rating").text().trim() || null,
      cast: $('[itemprop="actors"] [itemprop="name"]').map((i, el) => $(el).text().trim()).get(),
      players: $('a[id^="player"]').map((i, el) => ({
        playerName: $(el).text().trim(),
        playerId: $(el).attr("href").replace("#", "")
      })).get(),
      downloads: $(".gmr-download-list a").map((i, el) => ({
        label: $(el).text().trim(),
        link: $(el).attr("href")
      })).get()
    };
  }

  async searchMovies(query) {
    await this.init();
    const response = await fetch(`${this.baseUrl}?s=${encodeURIComponent(query)}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const data = [];

    $("article.item").each((i, el) => {
      const title = $(el).find("h2.entry-title").text().trim();
      const linkStream = $(el).find("a").attr("href");
      const poster = $(el).find("img").attr("src");
      const rating = $(el).find("div.gmr-rating-item").text().trim();
      const duration = $(el).find("div.gmr-duration-item").text().trim();
      let slug = linkStream.replace(this.baseUrl, "").replace(/^\/|\/$/g, "");
      let type = slug.includes("tv") ? "TV-Shows" : "Movies";
      if (type === "TV-Shows") slug = slug.replace("tv/", "");

      data.push({ title, linkStream, poster, rating, duration, slug, type, encodeurl: Buffer.from(linkStream).toString('base64') });
    });
    return data;
  }
}
