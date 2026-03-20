import * as cheerio from 'cheerio';
import axios from 'axios';

export async function getScribdDownloadUrl(scribdUrl) {
  try {
    const response = await fetch(`https://scribdsdownloader.com/download/?url=${encodeURIComponent(scribdUrl)}&scrape_data=Get+PDF`);
    const text = await response.text();
    const $ = cheerio.load(text);
    const script = $('script').filter((_, el) => $(el).html().includes('handleClick')).html();
    const match = script.match(/handleClick\("([^"]+)"\)/);
    
    if (!match) throw new Error("Download link not found");

    const res = await axios.get(match[1], {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://compress-pdf.vietdreamhouse.com/'
      }
    });
    return res.data;
  } catch (error) {
    console.error("❌ Scribd Error:", error.message);
    throw error;
  }
}
