import express from "express";
import * as rmbgController from "../controllers/rmbg.controller.js";

const router = express.Router();

router.get("/v1/remove-bg", rmbgController.rmbg);

export default router;
