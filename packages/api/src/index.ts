import { os, ORPCError } from "@orpc/server";
import { Context } from "./context"; // Import the type

// Initialize os with the Context type
const o = os.$context<Context>();

const authMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session || !context.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "You must be logged in.",
    });
  }

  return next({
    context: {
      session: context.session,
      user: context.user,
    },
  });
});

export const publicProcedure = o;
export const protectedProcedure = o.use(authMiddleware);
export const router = o.router.bind(o); // Bind for safety
