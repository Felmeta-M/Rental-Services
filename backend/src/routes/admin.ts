import express from "express";

import {Router} from "express";
import AdminContoller from "../controllers/adminController";
import admin from "../middlewares/admin";

var router : Router = express.Router();

router.get("/feed",admin, AdminContoller.pendingProperties);
router.post("/approve/:id",admin, AdminContoller.approveProperty);
router.delete("/approve/:id",admin, AdminContoller.rejectProperty);

export default router;