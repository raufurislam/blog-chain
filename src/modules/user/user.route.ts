import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/", userController.getAllFromDB);

router.get("/:id", userController.getUserById);

router.post("/", userController.createUser);

export const userRouter = router;
