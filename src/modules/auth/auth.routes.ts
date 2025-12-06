import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

router.post('/signup', authControllers.signupUser )
router.post('/signin', authControllers.userLogin )



export const authRoutes = router;
