import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    // log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = (globalThis as any).prisma ?? prismaClientSingleton();

export default prisma;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
