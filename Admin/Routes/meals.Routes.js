import express from "express";
import {
  createMeals,
  updateMeals,
  readAllmeals,
  readOnesMeals,
  deleteOneMeals,
  deleteAllMealsItems,
  categoryFindmeals,
} from "../../Admin/Controller/meals.js";
import upload from "../../Middelwares/multer.js"


const router = express.Router();

router.post("/createMeals",upload.single('images'),createMeals);
router.put("/updateMeals/:id",upload.single('images'),updateMeals);
router.get("/readAllmeals",readAllmeals);
router.get("/readOnesMeals/:id",readOnesMeals);
router.post("/deleteOneMeals",deleteOneMeals);
router.post("/deleteAllMealsItems",deleteAllMealsItems);
router.post("/categoryFindmeals",categoryFindmeals);

export default router;
