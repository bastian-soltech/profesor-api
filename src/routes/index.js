import express from "express";
import spotifyRoutes from "./spotify.routes.js";
import tiktokRoutes from "./tiktok.routes.js";
import youtubeRoutes from "./youtube.routes.js";
import moviesRoutes from "./movies.routes.js";
import rmbgRoutes from "./rmbg.js";
import summarizerRoutes from "./summarizer.routes.js";
import ProxyRouter from './proxy.routes.js'
const router = express.Router();

router.use("/spotify", spotifyRoutes);
router.use("/tiktok", tiktokRoutes);
router.use("/youtube", youtubeRoutes);
router.use("/movies", moviesRoutes);
router.use("/rm-bg", rmbgRoutes);
router.use("/summarize", summarizerRoutes);
router.use('/proxy',ProxyRouter)

export default router;
