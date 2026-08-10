import { Router } from "express";

import { 
    createTaskHandler,
    getTask, 
    listTasks,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTask);

router.post("/", createTaskHandler);

export default router;