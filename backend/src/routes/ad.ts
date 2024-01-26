import express from "express";
import {Router} from "express";
import AdController from "../controllers/adController"
import admin from "../middlewares/admin";

var router : Router = express.Router();

router.post("/ads", AdController.createAd);
router.get("/ads", admin, AdController.getTodaysAds);
router.put("/ads/:id/approve", AdController.approveAd);

export default router;