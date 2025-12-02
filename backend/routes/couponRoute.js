import express from "express";
import { applyCoupon, createCoupon, getCoupons } from "../controllers/couponController.js";
import { adminMiddleware } from "../middleware/auth.js";

const couponRouter = express.Router();

couponRouter.post("/apply", applyCoupon);
couponRouter.post("/create", adminMiddleware, createCoupon);
couponRouter.get("/list", adminMiddleware, getCoupons);

export default couponRouter;