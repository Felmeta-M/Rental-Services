import express ,{Router} from "express";
import PropertyController from "../controllers/propertyController"
import auth from "../middlewares/auth";
// import upload from "../middlewares/uploads";
import upload from "../controllers/uploadImage";

var router : Router = express.Router();

router.get("/",PropertyController.getProperties)
router.post("/",auth,upload.multiUpload,PropertyController.addProperty);

router.get("/search",PropertyController.searchProperties);
router.get("/top",PropertyController.bestRatedProperties);

router.get("/:id",PropertyController.getProperty);
router.put("/:id",auth,PropertyController.updateProperty);

router.get("/:id/review",auth,PropertyController.getUserReview);
router.post("/:id/review",auth,PropertyController.reviewProperty);
router.put("/:id/review",auth,PropertyController.updateReviewProperty);

router.post("/:id/like",auth,PropertyController.likeProperty);
router.delete("/:id/like",auth,PropertyController.unlikeProperty);

export default router;  