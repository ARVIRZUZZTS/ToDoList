import { Router } from "express";
import { getSession } from "../controllers/sessionController.js";

const router = Router();

router.post("/session", getSession);

export default router;
