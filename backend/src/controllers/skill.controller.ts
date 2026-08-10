import type { NextFunction, Request, Response } from "express";

import { getAllSkills, getSkillById} from "../services/skill.service.js";

export async function listSkills(
  req: Request, 
  res: Response,
  next: NextFunction) {
  try {
    const skills = await getAllSkills();

    res.json(skills);
  } catch (error) {
    next(error);
  }
}

export async function getSkill(
  req: Request, 
  res: Response,
  next: NextFunction
) {
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
    next(error);
  }
}