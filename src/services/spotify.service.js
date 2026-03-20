import axios from "axios";

export class Spotimp3 {
  async getDetail(q, page = 1, limit = 3) {
    try {
      const { data } = await axios.get(
        `https://spotmp3.app/api/song-details?url=${encodeURIComponent(q)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: "https://spotmp3.app/",
          },
          timeout: 20000,
        }
      );
      
      const songs = Array.isArray(data.songs) ? data.songs : data.songs || [];
      const startIndex = (page - 1) * limit;
      const paginatedSongs = songs.slice(startIndex, startIndex + limit);

      return {
        contentType: data.contentType,
        page,
        limit,
        total: songs.length,
        totalPages: Math.ceil(songs.length / limit),
        data: paginatedSongs,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async download(url) {
    try {
      const res = await axios.post(
        "https://www.spotmp3.app/api/download",
        { url },
        {
          responseType: "stream",
          headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: "https://www.spotmp3.app/",
            "Content-Type": "application/json",
          },
          timeout: 50000,
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
