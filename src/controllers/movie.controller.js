import { filmApik, hostingHola } from "../services/movie.service.js";
import { request } from 'undici';
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

export const filmApikBox = catchAsync(async (req, res) => {
  const { page } = req.query;
  const data = await filmApik.BoxOfficeApik(page);
  successResponse(res, data, 'Success fetch box office from filmapik');
});

export const filmApikTrending = catchAsync(async (req, res) => {
  const { page } = req.query;
  const data = await filmApik.TrendingApik(page);
  successResponse(res, data, 'Success fetch trending from filmapik');
});

export const filmApikLatest = catchAsync(async (req, res) => {
  const { page } = req.query;
  const data = await filmApik.LatestApik(page);
  successResponse(res, data, 'Success fetch latest from filmapik');
});

export const filmApikDownload = catchAsync(async (req, res) => {
  const { slug, type } = req.query;
  const data = await filmApik.DownloadApik(slug, type);
  successResponse(res, data, 'Success fetch download link from filmapik');
});

export const filmApikStream = catchAsync(async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  const { body, headers } = await request(url);
  res.setHeader('Content-Type', headers['content-type'] || 'video/mp4');
  body.pipe(res);
});

export const filmApikSearch = catchAsync(async (req, res) => {
  const { q } = req.query;
  const data = await filmApik.SearchApik(q);
  successResponse(res, data, 'Success search from filmapik');
});

export const filmApikDramaStream = catchAsync(async (req, res) => {
  const { slug } = req.query;
  const data = await filmApik.StreamingDrama(slug);
  successResponse(res, data, 'Success fetch drama stream from filmapik');
});

export const hostingHolaIndo = catchAsync(async (req, res) => {
  const { page } = req.query;
  const host = new hostingHola();
  const data = await host.getIndoMovies(page);
  successResponse(res, data, 'Success fetch indo movies from hostinghola');
});

export const hostingHolaStreamMovies = catchAsync(async (req, res) => {
  const { url, slug, type, player } = req.query;
  const host = new hostingHola();
  const data = await host.getStreaming(slug, url, type, player);
  successResponse(res, data, 'Success fetch stream movie from hostinghola');
});

export const hostingHolaSearch = catchAsync(async (req, res) => {
  const { q } = req.query;
  const host = new hostingHola();
  const data = await host.searchMovies(q);
  successResponse(res, data, 'Success search from hostinghola');
});
