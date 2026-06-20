import path from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma config file (replaces the deprecated `package.json#prisma` block).
// `dotenv/config` restores .env loading, which Prisma skips once a config file
// is present. See: https://pris.ly/prisma-config
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
