import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const frontend = await prisma.skill.upsert({
    where: {
      name: "Frontend",
    },
    update: {},
    create: {
      name: "Frontend",
    },
  });

  const backend = await prisma.skill.upsert({
    where: {
      name: "Backend",
    },
    update: {},
    create: {
      name: "Backend",
    },
  });

  const alice = await prisma.developer.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "Alice",
    },
    create: {
      id: 1,
      name: "Alice",
    },
  });

  const bob = await prisma.developer.upsert({
    where: {
      id: 2,
    },
    update: {
      name: "Bob",
    },
    create: {
      id: 2,
      name: "Bob",
    },
  });

  const carol = await prisma.developer.upsert({
    where: {
      id: 3,
    },
    update: {
      name: "Carol",
    },
    create: {
      id: 3,
      name: "Carol",
    },
  });

  const dave = await prisma.developer.upsert({
    where: {
      id: 4,
    },
    update: {
      name: "Dave",
    },
    create: {
      id: 4,
      name: "Dave",
    },
  });

  await prisma.developer.update({
    where: {
      id: alice.id,
    },
    data: {
      skills: {
        set: [{ id: frontend.id }],
      },
    },
  });

  await prisma.developer.update({
    where: {
      id: bob.id,
    },
    data: {
      skills: {
        set: [{ id: backend.id }],
      },
    },
  });

  await prisma.developer.update({
    where: {
      id: carol.id,
    },
    data: {
      skills: {
        set: [
          { id: frontend.id },
          { id: backend.id },
        ],
      },
    },
  });

  await prisma.developer.update({
    where: {
      id: dave.id,
    },
    data: {
      skills: {
        set: [{ id: backend.id }],
      },
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });