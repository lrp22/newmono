import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// We will load the env from the apps/server folder later
dotenv.config({ path: "../../apps/server/.env" });

export default defineConfig({
  schema: "./src/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
