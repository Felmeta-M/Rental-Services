import express from "express";
import {Router} from "express";
import AuthController from "../controllers/authController";
import auth from "../middlewares/auth";

var router : Router = express.Router();

router.post("/",AuthController.getToken);
router.get("/isAdmin",auth, AuthController.isAdmin);

export default router;