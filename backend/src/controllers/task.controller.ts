import type {
  NextFunction,
  Request,
  Response
} from "express";

import { 
    createTask,
    getAllTasks, 
    getTaskById,
    updateTask,
} from "../services/task.service.js";

export async function createTaskHandler(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  try {
    const { title, skillIds, parentTaskId } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({
        error: "Title is required",
      });
      return;
    }

    if (
      !Array.isArray(skillIds) ||
      !skillIds.every(
        (id) => Number.isInteger(id) && id > 0
      )
    ) {
      res.status(400).json({
        error: "skillIds must be an array of valid skill IDs",
      });
      return;
    }

    if (
      parentTaskId !== undefined &&
      (!Number.isInteger(parentTaskId) || parentTaskId <= 0)
    ) {
      res.status(400).json({
        error: "parentTaskId must be a valid task ID",
      });
      return;
    }

    const task = await createTask({
      title: title.trim(),
      skillIds,
      parentTaskId,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskHandler(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid task ID",
      });
      return;
    }

    const { developerId, status } = req.body;

    if (
      developerId !== undefined &&
      developerId !== null &&
      (!Number.isInteger(developerId) || developerId <= 0)
    ) {
      res.status(400).json({
        error: "developerId must be a valid developer ID or null",
      });
      return;
    }

    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        error: "Invalid task status",
      });
      return;
    }

    if (developerId === undefined && status === undefined) {
      res.status(400).json({
        error: "At least one field must be provided",
      });
      return;
    }

    const task = await updateTask(id, {
      developerId,
      status,
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function listTasks(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  try {
    const tasks = await getAllTasks();

    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function getTask(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid task ID",
      });
      return;
    }

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        error: "Task not found",
      });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
}