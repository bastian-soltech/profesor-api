import express from "express";
import * as summarizerController from "../controllers/summarizer.controller.js";

const router = express.Router();

router.get("/youtube", summarizerController.recapio);

export default router;
