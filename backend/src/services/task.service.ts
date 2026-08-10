import { prisma } from "../lib/prisma.js";

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
  const uniqueSkillIds = [...new Set(input.skillIds)];

  const skills = await prisma.skill.findMany({
    where: {
      id: {
        in: uniqueSkillIds,
      },
    },
  });

  if (skills.length !== uniqueSkillIds.length) {
    throw new Error("INVALID_SKILLS");
  }

  if (input.parentTaskId !== undefined) {
    const parentTask = await prisma.task.findUnique({
      where: {
        id: input.parentTaskId,
      },
    });

    if (!parentTask) {
      throw new Error("PARENT_TASK_NOT_FOUND");
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
    throw new Error("TASK_NOT_FOUND");
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
      throw new Error("DEVELOPER_NOT_FOUND");
    }

    const developerSkillIds = new Set(
      developer.skills.map((skill) => skill.id)
    );

    const hasAllRequiredSkills = task.skills.every((skill) =>
      developerSkillIds.has(skill.id)
    );

    if (!hasAllRequiredSkills) {
      throw new Error("DEVELOPER_MISSING_REQUIRED_SKILLS");
    }
  }

  if (input.status === "DONE") {
    const hasIncompleteSubtasks = task.subtasks.some(
      (subtask) => subtask.status !== "DONE"
    );

    if (hasIncompleteSubtasks) {
      throw new Error("SUBTASKS_NOT_DONE");
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