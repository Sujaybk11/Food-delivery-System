import express from "express";
import { addFood, listFood, removeFood, seedFoodItems, updateInventory, updatePrice, updateImage, toggleAvailability, updateStock } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})

foodRouter.post("/add",upload.single("image"),authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);
foodRouter.post("/update-inventory",authMiddleware,updateInventory);
foodRouter.post("/update-price",authMiddleware,updatePrice);
foodRouter.post("/update-image",upload.single("image"),authMiddleware,updateImage);
foodRouter.post("/seed",seedFoodItems);
foodRouter.post("/toggle-availability",authMiddleware,toggleAvailability);
foodRouter.post("/update-stock",authMiddleware,updateStock);

export default foodRouter;
