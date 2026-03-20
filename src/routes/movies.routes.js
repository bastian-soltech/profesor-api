import express from "express";
import * as movieController from "../controllers/movie.controller.js";

const router = express.Router();

router.get('/v1/box-office', movieController.filmApikBox);
router.get('/v1/trending', movieController.filmApikTrending);
router.get('/v1/latest', movieController.filmApikLatest);
router.get('/v1/download', movieController.filmApikDownload);
router.get('/v1/search', movieController.filmApikSearch);
router.get('/v1/streaming-drama', movieController.filmApikDramaStream);
router.get('/v1/stream', movieController.filmApikStream);
router.get('/v2/indo-movie', movieController.hostingHolaIndo);
router.get('/v2/stream/movie', movieController.hostingHolaStreamMovies);
router.get('/v2/search', movieController.hostingHolaSearch);

export default router;
