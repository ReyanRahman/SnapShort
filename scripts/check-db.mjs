import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection OK.");
  } catch (error) {
    console.error("Database connection failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
