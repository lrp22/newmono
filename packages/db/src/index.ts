import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import * as schema from "./schema";

// Load env vars (mimicking Repo B's setup to ensure it finds the .env)
import * as dotenv from "dotenv";
dotenv.config({ path: "../../apps/server/.env" });

// Configures Neon to use 'ws' package for WebSockets in Node.js environments
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(process.env.DATABASE_URL);

// Pass the schema here so you can use query syntax (db.query.user.findMany...)
export const db = drizzle(sql, { schema });

export * from "./schema";
