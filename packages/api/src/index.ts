import { os, ORPCError } from "@orpc/server";
import { auth } from "auth";

// Helper to extract the exact types returned by getSession
type SessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>;
type Session = NonNullable<SessionResponse>["session"];
type User = NonNullable<SessionResponse>["user"];

export type Context = {
  session?: Session;
  user?: User;
  req?: any;
};

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

// 👇 FIX: Bind the router to 'o' so it doesn't lose context
export const router = o.router.bind(o);
