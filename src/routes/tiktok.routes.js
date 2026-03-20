import express from "express";
import * as tiktokController from "../controllers/tiktok.controller.js";

const router = express.Router();

router.get("/v1/download", tiktokController.sstik);

export default router;
