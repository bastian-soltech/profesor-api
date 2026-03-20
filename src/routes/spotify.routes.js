import express from "express";
import * as spotifyController from "../controllers/spotify.controller.js";

const router = express.Router();

router.get("/v1/detail", spotifyController.spotidetail);
router.get("/v1/download", spotifyController.spotidownload);

export default router;
