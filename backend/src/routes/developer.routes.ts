import { Router } from "express";

import { listDevelopers, getDeveloper } from "../controllers/developer.controller.js";

const router = Router();

router.get("/", listDevelopers);
router.get("/:id", getDeveloper);

export default router;