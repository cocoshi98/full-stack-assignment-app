import { Router } from "express";

import { getSkill,listSkills } from "../controllers/skill.controller.js";

const router = Router();

router.get("/", listSkills);
router.get("/:id", getSkill);

export default router;