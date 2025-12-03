import { router, publicProcedure, protectedProcedure } from "../index";
import type { RouterClient } from "@orpc/server";
import { todoRouter } from "./todo";

export const appRouter = router({
  health: publicProcedure.handler(async () => {
    return { status: "ok", time: new Date() };
  }),

  me: protectedProcedure.handler(async ({ context }) => {
    return { user: context.user };
  }),
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
// 👇 Add this export
export type AppRouterClient = RouterClient<typeof appRouter>;
