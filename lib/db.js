import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  prisma = new PrismaClient();
  globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

export default prisma;
