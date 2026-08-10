import { prisma } from "../lib/prisma.js";

export async function getAllSkills() {
  return prisma.skill.findMany({
    include: {
      developers: true,
      tasks: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getSkillById(id: number) {
  return prisma.skill.findUnique({
    where: {
      id,
    },
    include: {
      developers: true,
      tasks: true,
    },
  });
}