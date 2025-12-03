import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "auth";
import { RPCHandler } from "@orpc/server/node";
import { onError } from "@orpc/server";
import { appRouter } from "api/routers";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// 1. Mount Better Auth
app.all("/api/auth/*", toNodeHandler(auth));

// 2. Setup oRPC
const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error("RPC Error:", error);
    }),
  ],
});

// 3. Mount oRPC with Auth Context
app.use("/api", async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const result = await rpcHandler.handle(req, res, {
    prefix: "/api",
    context: {
      req,
      session: session?.session,
      user: session?.user,
    },
  });

  if (result.matched) return;
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running! 🚀 API is available at /api");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
