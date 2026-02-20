import "dotenv/config";
import { env } from "~/env";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const adapter = new PrismaBetterSqlite3(
  {
    url: process.env.DATABASE_URL,
  },
  {
    timestampFormat: "iso8601",
  },
);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
