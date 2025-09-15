import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.loginWithEmailAndPassword);

router.post("/google", AuthController.authWithGoogle);

export const authRouter = router;
