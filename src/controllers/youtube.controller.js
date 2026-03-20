import { Ddownr, ssVid } from "../services/youtube.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

const ddownr = new Ddownr();

export const Ddownr_metadata = catchAsync(async (req, res) => {
  const { url, format } = req.query;
  if (!url || !format) {
    return res.status(400).json({ status: 400, message: "url dan format wajib diisi" });
  }

  const data = await ddownr.getInfo(url, format);
  successResponse(res, data, 'Success fetch youtube metadata');
});

export const Ddownr_download = catchAsync(async (req, res) => {
  const { progress_url } = req.query;
  if (!progress_url) {
    return res.status(400).json({ status: 400, message: "progress_url wajib diisi" });
  }

  const data = await ddownr.download(progress_url);
  successResponse(res, data, 'Success fetch youtube download status');
});

export const ssvid = catchAsync(async (req, res) => {
  const { url, format } = req.query;
  const data = await ssVid.download(url, format);
  successResponse(res, data, 'Success fetch youtube download link from ssvid');
});
