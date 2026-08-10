import type { 
  NextFunction,
  Request, 
  Response 
} from "express";

import { getAllDevelopers, getDeveloperById } from "../services/developer.service.js";

export async function listDevelopers(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  try {
    const developers = await getAllDevelopers();

    res.json(developers);
  } catch (error) {
    next(error);
  }
}

export async function getDeveloper(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid developer ID",
      });
      return;
    }

    const developer = await getDeveloperById(id);

    if (!developer) {
      res.status(404).json({
        error: "Developer not found",
      });
      return;
    }

    res.json(developer);
  } catch (error) {
    next(error);
  }
}

