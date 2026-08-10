import { Router } from "express";

import { 
    createTaskHandler,
    getTask, 
    listTasks,
    updateTaskHandler,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTask);

router.post("/", createTaskHandler);
router.patch("/:id", updateTaskHandler);

export default router;