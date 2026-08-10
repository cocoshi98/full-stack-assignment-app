import type { Request, Response } from "express";

import { getAllSkills, getSkillById} from "../services/skill.service.js";

export async function listSkills(req: Request, res: Response) {
  try {
    const skills = await getAllSkills();

    res.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);

    res.status(500).json({
      error: "Failed to fetch skills",
    });
  }
}

export async function getSkill(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid skill ID",
      });
      return;
    }

    const skill = await getSkillById(id);

    if (!skill) {
      res.status(404).json({
        error: "Skill not found",
      });
      return;
    }

    res.json(skill);
  } catch (error) {
    console.error("Failed to fetch skill:", error);

    res.status(500).json({
      error: "Failed to fetch skill",
    });
  }
}