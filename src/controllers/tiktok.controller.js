import { sstik } from "../services/tiktok.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

export const sstik_download = catchAsync(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  const data = await sstik(url);
  successResponse(res, data, 'Success fetch tiktok download link');
});

// Alias for existing route compatibility if needed
export { sstik_download as sstik };
