import { Router } from "express";
import { registerHandler, loginHandler } from "./auth.controller";

const router = Router();

// Registro de usuario
router.post('/register', registerHandler);

// Login de usuario
router.post('/login', loginHandler);

export default router;
