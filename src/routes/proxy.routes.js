import express from "express";
import * as ProxyController from "../controllers/proxy.controller.js";


const router = express.Router();

router.get("/video", ProxyController.StreamingMovieProxy);

export default router;
