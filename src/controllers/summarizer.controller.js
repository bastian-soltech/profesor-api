import { RecapioClient } from "../services/youtubesummarizer.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

export const recapio = catchAsync(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  const urlObj = new URL(url);
  urlObj.search = "";
  const cleanUrl = urlObj.toString();

  const recapio = new RecapioClient(cleanUrl);
  const videoData = await recapio.start();
  const summary = await recapio.sendMessage(
    "Extract the most important bullet points from this video, organized in a clear, structured format."
  );

  successResponse(res, { video_info: videoData, summary }, 'Success summarize video');
});
