import express from "express";
import { loginAdmin, verifyAdmin, getAnalytics, getUsers } from "../controllers/adminController.js";
import { adminMiddleware } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/verify", verifyAdmin);
adminRouter.get("/analytics", adminMiddleware, getAnalytics);
adminRouter.get("/users", adminMiddleware, getUsers);

export default adminRouter;