import express from "express";
import upload from "../../Middelwares/multer.js"

import {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  getSingleExpense
} from "../../Admin/Controller/expense.js";

const router = express.Router();

router.post("/addExpense", upload.single("billImage"),addExpense);
router.get("/getAllExpense",getAllExpense);
router.get("/getSingleExpense/:id",getSingleExpense)
router.put("/update/:id", upload.single("billImage"),updateExpense);
router.delete("/delete/:id",deleteExpense);


export default router