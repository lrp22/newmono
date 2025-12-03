import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@app/auth";
import { RPCHandler } from "@orpc/server/node";
import { appRouter } from "@app/api/routers";
import { createContext } from "@app/api/context";

const app = express();
const port = process.env.PORT || 3001;

// Improved CORS from Repo B
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:3000",
      "http://localhost:8081", // Expo Metro bundler often runs here
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true, // Critical for cookies
  })
);

app.use(express.json());

// 1. Mount Better Auth
app.all("/api/auth/*", toNodeHandler(auth));

// 2. Setup oRPC with the extracted context
const rpcHandler = new RPCHandler(appRouter);

app.use("/api", async (req, res, next) => {
  // Create context using the logic we extracted to the package
  const context = await createContext({ req, res });

  const result = await rpcHandler.handle(req, res, {
    prefix: "/api",
    context, // Pass the context
  });

  if (result.matched) return;
  next();
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
