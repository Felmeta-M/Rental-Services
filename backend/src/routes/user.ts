import express from "express";
import {Router} from "express";
import UserController from "../controllers/userController"
import auth from "../middlewares/auth";
// import upload from "../middlewares/uploads";
import upload from "../controllers/uploadImage";

var router : Router = express.Router();

router.post("/",UserController.createUser);
router.put("/", auth, UserController.updateUser);
router.get("/me",auth,UserController.myInfo);
router.post("/deleteme",auth,UserController.deleteUser);
router.put("/profile",auth,upload.singleUpload,UserController.uploadPhoto);

router.get("/posts", auth, UserController.getPosts);

router.post("/wishlists", auth, UserController.addWishlist);
router.get("/wishlists", auth, UserController.getWishlists);

export default router;