import axios from 'axios';

export class Ddownr {
  async Progress(progress_url) {
    try {
      let progress = await axios.get(progress_url);
      while (progress.data.success < 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        progress = await axios.get(progress_url);
      }
      return progress.data;
    } catch (err) {
      throw new Error("Gagal fetch progress: " + err.message);
    }
  }

  async getInfo(url, format) {
    const baseurl = `https://p.savenow.to/ajax/download.php?copyright=0&format=${format}&url=${url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    const { data } = await axios.get(baseurl);
    return data;
  }

  async download(progress_url) {
    const downloadResult = await this.Progress(progress_url);
    return { downloadResult };
  }
}

export const ssVid = {
  baseUrl: { origin: 'https://ssvid.net' },
  baseHeaders: {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'origin': 'https://ssvid.net',
    'referer': 'https://ssvid.net/youtube-to-mp3'
  },

  validateFormat(userFormat) {
    const validFormat = ['mp3', '360p', '720p', '1080p'];
    if (!validFormat.includes(userFormat)) throw Error(`invalid format!. available formats: ${validFormat.join(', ')}`);
  },

  handleFormat(userFormat, searchJson) {
    this.validateFormat(userFormat);
    let result;
    if (userFormat === 'mp3') {
      result = searchJson.links?.mp3?.mp3128?.k;
    } else {
      const allFormats = Object.entries(searchJson.links.mp4);
      const quality = allFormats.map(v => v[1].q).filter(v => /\d+p/.test(v)).map(v => parseInt(v)).sort((a, b) => b - a).map(v => v + 'p');
      const selectedFormat = quality.includes(userFormat) ? userFormat : quality[0];
      result = allFormats.find(v => v[1].q === selectedFormat)?.[1]?.k;
    }
    if (!result) throw Error(`${userFormat} not available`);
    return result;
  },

  async hit(path, payload) {
    const body = new URLSearchParams(payload);
    const r = await fetch(`${this.baseUrl.origin}${path}`, { headers: this.baseHeaders, body, method: 'post' });
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`);
    return await r.json();
  },

  async download(queryOrYtUrl, userFormat = 'mp3') {
    this.validateFormat(userFormat);
    let search = await this.hit('/api/ajax/search', { query: queryOrYtUrl, cf_token: "", vt: "youtube" });

    if (search.p === 'search') {
      if (!search?.items?.length) throw Error(`No results for ${queryOrYtUrl}`);
      const videoUrl = 'https://www.youtube.com/watch?v=' + search.items[0].v;
      search = await this.hit('/api/ajax/search', { query: videoUrl, cf_token: "", vt: "youtube" });
    }

    const vid = search.vid;
    const k = this.handleFormat(userFormat, search);
    const convert = await this.hit('/api/ajax/convert', { k, vid });

    if (convert.c_status === 'CONVERTING') {
      for (let i = 0; i < 5; i++) {
        await new Promise(re => setTimeout(re, 5000));
        const check = await this.hit('/api/convert/check?hl=en', { vid, b_id: convert.b_id });
        if (check.c_status === 'CONVERTED') return check;
      }
      throw Error('File still converting or timed out');
    }
    return convert;
  }
};
