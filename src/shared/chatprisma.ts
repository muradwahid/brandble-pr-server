// import { PrismaClient } from "@prisma/client";

import prisma from "./prisma";

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export const chatPrisma = prisma;