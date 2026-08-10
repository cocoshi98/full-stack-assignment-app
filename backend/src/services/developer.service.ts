import { prisma } from "../lib/prisma.js";

export async function getAllDevelopers() {
  return prisma.developer.findMany({
    include: {
      skills: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getDeveloperById(id: number) {
  return prisma.developer.findUnique({
    where: {
      id,
    },
    include: {
      skills: true,
    },
  });
}