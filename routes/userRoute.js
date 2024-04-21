import express from 'express';
import { Login, forgetPassword, getUser, register, resetPassword, updateUser, verifyEmail } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post("/register" , register);
userRouter.post("/login" , Login);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.get("/get-user/:id" , getUser);
userRouter.patch("/update-user/:id" , authMiddleware , updateUser)
userRouter.post("/forget-password" ,forgetPassword );
userRouter.post("/reset-password" , resetPassword);


export default userRouter;