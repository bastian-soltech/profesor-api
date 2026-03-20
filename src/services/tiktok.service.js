import * as cheerio from 'cheerio';

export async function sstik(url) {
  const formData = new URLSearchParams();
  formData.append('id', url);
  formData.append('locale', 'id');
  formData.append('tt', 'eG1qNHQ_');

  const response = await fetch('https://ssstik.io/abc?url=dl', {
    method: 'POST',
    headers: {
      'referer': 'https://ssstik.io/id',
      'user-agent': 'Mozilla/5.0'
    },
    body: formData
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const stats = $('div#trending-actions div').children().not('svg').map((i, el) => $(el).text().trim()).get();
  const styleTag = $('style').first().text();
  const imageUrl = styleTag.match(/background-image:\s*url\((.*?)\);/)?.[1]?.trim().replace(/['"]/g, '');

  return {
    videoLink: $('a.without_watermark').attr('href'),
    videoImage: imageUrl,
    stats: {
      likes: stats[1],
      comments: stats[2],
      shares: stats[3]
    },
    authorName: $('div.pd-lr h2').text().trim(),
    videoTitle: $('div#avatarAndTextUsual p.maintext').text().trim(),
    imageAuthorLink: $('img.result_author').attr('src'),
    audioLink: $('a.music').attr('href')
  };
}
