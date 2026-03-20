import * as cheerio from 'cheerio';
import axios from 'axios';

const BASE_URL = "https://filmapik.channel";
const API_URL = "https://filmapik.coupons";

const scrapeItems = ($) => {
  const data = [];
  $('article.item.movies').each((i, el) => {
    const poster = $(el).find('img').attr('src');
    const rating = $(el).find('div.rating').text().trim();
    const title = $(el).find('h3 a').text().trim();
    const slug = $(el).find('a').attr('href').replace(BASE_URL, '').replace(API_URL, '').replace(/^\/|\/$/g, '');

    data.push({
      posterUrls: poster,
      moviesTitle: title,
      slug,
      Type: "Movies",
      moviesRating: rating
    });
  });
  return data;
};

export const filmApik = {
  BoxOfficeApik: async (page = 1) => {
    const response = await fetch(`${API_URL}/category/box-office/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    return { data: scrapeItems($) };
  },

  TrendingApik: async (page = 1) => {
    const response = await fetch(`${API_URL}/trending-2/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    return { data: scrapeItems($) };
  },

  LatestApik: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/latest/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    return { data: scrapeItems($) };
  },

  DownloadApik: async (slug, type = "Movies") => {
    if (type === "Movies") {
      const response = await fetch(`${BASE_URL}/nonton-film-${slug}-subtitle-indonesia/play`);
      const data = await response.text();
      const $ = cheerio.load(data);
      const links = [];

      $('#playeroptions > ul').each((i, el) => {
        const server = $(el).find('.server_title').text().trim();
        const li = $(el).find('li.dooplay_player_option');
        const url = li.attr('data-url');
        const quality = li.find('.title').text().trim();
        links.push({ server, quality, url });
      });

      const title = $('h1[itemprop="name"]').text().replace('Nonton Film', '').replace('Filmapik', '').trim();
      const genres = $('.sgeneros a').map((i, el) => $(el).text().trim()).get();
      const director = $('span.tagline:contains("Director") a').first().text().trim();
      const actors = $('span[itemprop="actor"] a').map((i, el) => $(el).text().trim()).get();
      const country = $('span.country:contains("Country") a').text().trim();
      const duration = $('span.runtime').text().replace('Duration', '').replace(':', '').trim();
      const quality = $('span.country:contains("Quality") a').text().trim();
      const releaseYear = $('span.country:contains("Release") a').text().trim();
      const imdb = $('#repimdb strong').text().trim();
      const resolution = $('span.country:contains("Resolusi") a').text().trim();
      const synopsis = $('.sbox h2:contains("Synopsis")').next('.wp-content').text().trim();

      return {
        title, genres, director, actors, source: 'filmapik',
        country, duration, quality, slug, releaseYear, imdb, resolution, synopsis, links
      };
    }
    
    // TV Shows logic simplified
    if (type === "TV-Shows") {
      const response = await fetch(`${BASE_URL}/tvshows/nonton-${slug}-sub-indo/`);
      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $('h1').first().text().trim();
      const poster = $('.poster img').attr('src') || $('.poster img').attr('data-src');
      const genres = $('.sgeneros a').map((i, el) => $(el).text().trim()).get();
      
      const seasons = [];
      $('#seasons .se-c').each((i, se) => {
        const $se = $(se);
        const seasonNumberText = $se.find('.se-t').first().text().trim() || $se.find('.title').first().text().trim();
        const seasonNumber = (seasonNumberText.match(/\d+/) || [i + 1])[0];

        const episodes = [];
        $se.find('ul.episodios li').each((j, li) => {
          const a = $(li).find('a').first();
          episodes.push({
            text: a.text().trim() || $(li).text().trim(),
            href: a.attr('href'),
          });
        });

        seasons.push({ season: parseInt(seasonNumber), episodes });
      });

      return { title, poster, genres, seasons };
    }
  },

  StreamingDrama: async (slug) => {
    const response = await fetch(`${BASE_URL}${slug}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const servers = [];
    $('#playeroptions ul').each((i, el) => {
      const serverTitle = $(el).find('.server_title').text().trim();
      $(el).find('li.dooplay_player_option').each((j, li) => {
        servers.push({
          server: serverTitle.replace(/\s+/g, ' ').trim(),
          name: $(li).find('.title').text().trim(),
          url: $(li).attr('data-url'),
        });
      });
    });

    const episodes = $(".episodios li a").map((i, el) => ({
      title: $(el).text().trim(),
      url: $(el).attr("href"),
    })).get();

    return {
      title: $("h1").text().trim(),
      poster: $(".sheader .poster img").attr("src"),
      episodes,
      servers
    };
  },

  SearchApik: async (search) => {
    const { data: html } = await axios.get(`${BASE_URL}/?s=${encodeURIComponent(search)}`);
    const $ = cheerio.load(html);
    const data = [];

    $('.result-item').each((i, el) => {
      const title = $(el).find('.title a').text().trim();
      const poster = $(el).find('img').attr('src');
      const spanText = $(el).find('span').text().trim();
      const synopsis = $(el).find('.contenido p').text().replace('ALUR CERITA :', '').trim();

      data.push({ title, poster, spanText, synopsis, source: 'filmapik' });
    });
    return data;
  }
};
