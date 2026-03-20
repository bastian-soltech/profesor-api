import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetch HTML and parse with Cheerio
 */
export async function fetchHtml(url, timeout = 10000) {
  try {
    const { data } = await axios.get(url, {
      timeout,
      headers: {
        "User-Agent": "Mozilla/5.0",
      }
    });
    return cheerio.load(data);
  } catch (err) {
    console.error(`❌ Gagal fetch: ${url}`);
    throw new Error(err.message);
  }
}
