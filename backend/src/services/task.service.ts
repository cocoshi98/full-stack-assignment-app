import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/app-error.js";
import { classifyTaskSkills } from "./skill-classifier.service.js";

export interface CreateTaskInput {
  title: string;
  skillIds: number[];
  parentTaskId?: number;
}

export interface UpdateTaskInput {
  developerId?: number | null;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
}

export async function createTask(input: CreateTaskInput) {  
  let uniqueSkillIds = [...new Set(input.skillIds)];

  if (uniqueSkillIds.length === 0) {
    const classifiedSkillNames =
      await classifyTaskSkills(input.title);

    const classifiedSkills =
      await prisma.skill.findMany({
        where: {
          name: {
            in: classifiedSkillNames,
          },
        },
      });

    if (
      classifiedSkills.length !==
      classifiedSkillNames.length
    ) {
      throw new AppError(
        500,
        "Configured skills could not be found"
      );
    }

    uniqueSkillIds = classifiedSkills.map(
      (skill) => skill.id
    );
  }

  const skills = await prisma.skill.findMany({
    where: {
      id: {
        in: uniqueSkillIds,
      },
    },
  });

  if (skills.length !== uniqueSkillIds.length) {
    throw new AppError(
      400,
      "One or more skill IDs do not exist"
    );
  }

  if (input.parentTaskId !== undefined) {
    const parentTask = await prisma.task.findUnique({
      where: {
        id: input.parentTaskId,
      },
    });

    if (!parentTask) {
      throw new AppError(
        400,
        "Parent task does not exist"
      );
    }
  }

  return prisma.task.create({
    data: {
      title: input.title,

      skills: {
        connect: uniqueSkillIds.map((id) => ({ id })),
      },

      ...(input.parentTaskId !== undefined && {
        parentTask: {
          connect: {
            id: input.parentTaskId,
          },
        },
      }),
    },

    include: {
      developer: true,
      skills: true,
      parentTask: true,
      subtasks: true,
    },
  });
}

export async function updateTask(id: number, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      skills: true,
      subtasks: true,
    },
  });

  if (!task) {
    throw new AppError(
      404,
      "Task not found"
    );
  }

  if (input.developerId !== undefined && input.developerId !== null) {
    const developer = await prisma.developer.findUnique({
      where: {
        id: input.developerId,
      },
      include: {
        skills: true,
      },
    });

    if (!developer) {
      throw new AppError(
        400,
        "Developer does not exist"
      );
    }

    const developerSkillIds = new Set(
      developer.skills.map((skill) => skill.id)
    );

    const hasAllRequiredSkills = task.skills.every((skill) =>
      developerSkillIds.has(skill.id)
    );

    if (!hasAllRequiredSkills) {
      throw new AppError(
        400,
        "Developer does not have all required skills"
      );
    }
  }

  if (input.status === "DONE") {
    const hasIncompleteSubtasks = task.subtasks.some(
      (subtask) => subtask.status !== "DONE"
    );

    if (hasIncompleteSubtasks) {
      throw new AppError(
        400,
        "Task cannot be completed while subtasks are incomplete"
      );
    }
  }

  return prisma.task.update({
    where: {
      id,
    },
    data: {
      ...(input.developerId !== undefined && {
        developer:
          input.developerId === null
            ? {
                disconnect: true,
              }
            : {
                connect: {
                  id: input.developerId,
                },
              },
      }),

      ...(input.status !== undefined && {
        status: input.status,
      }),
    },

    include: {
      developer: true,
      skills: true,
      parentTask: true,
      subtasks: true,
    },
  });
}

export async function getAllTasks() {
  return prisma.task.findMany({
    include: {
      developer: true,
      skills: true,
      subtasks: {
        include: {
          developer: true,
          skills: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getTaskById(id: number) {
  return prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      developer: true,
      skills: true,
      parentTask: true,
      subtasks: {
        include: {
          developer: true,
          skills: true,
        },
      },
    },
  });
}