import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/signup', AuthController.createUser);
router.post('/signin', AuthController.loginUser);
router.get('/all-users', AuthController.allUsers);
// router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;