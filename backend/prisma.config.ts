import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: la URL de conexión va aquí, no en schema.prisma
// DATABASE_URL → Neon pooled (para runtime serverless)
// DIRECT_URL   → Neon direct (para migraciones Prisma CLI)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
