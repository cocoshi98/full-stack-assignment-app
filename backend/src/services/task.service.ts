import { prisma } from "../lib/prisma.js";

export interface CreateTaskInput {
  title: string;
  skillIds: number[];
  parentTaskId?: number;
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