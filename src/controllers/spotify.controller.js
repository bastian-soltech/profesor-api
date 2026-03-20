import { Spotimp3 } from "../services/spotify.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

export const spotidetail = catchAsync(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing q parameter" });
  }

  const spotify = new Spotimp3();
  const data = await spotify.getDetail(q, parseInt(page), parseInt(limit));

  if (!data) {
    throw new Error("Failed to get song detail");
  }

  successResponse(res, data, 'Success fetch spotify detail');
});

export const spotidownload = catchAsync(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  const spotify = new Spotimp3();
  const music = await spotify.download(url);
  const musicDetail = await spotify.getDetail(url);

  if (!music) {
    throw new Error("Failed to download track");
  }

  const title = Array.isArray(musicDetail)
    ? musicDetail[0]?.title
    : musicDetail.data?.[0]?.title || "track";

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(title)}.mp3`);
  music.pipe(res);
});
