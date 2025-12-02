import express from "express";
import { loginUser, registerUser, registerAdmin, listUsers, createUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/register-admin", registerAdmin);
userRouter.post("/login", loginUser);
userRouter.get("/list", authMiddleware, listUsers);
userRouter.post("/create", authMiddleware, createUser);

export default userRouter;
