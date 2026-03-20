import express from "express";
import * as youtubeController from "../controllers/youtube.controller.js";

const router = express.Router();

router.get("/v1/detail", youtubeController.Ddownr_metadata);
router.get("/v1/download", youtubeController.Ddownr_download);
router.get("/v2/download", youtubeController.ssvid);

export default router;
