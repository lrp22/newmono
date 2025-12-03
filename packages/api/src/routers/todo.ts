import { z } from "zod";
import { router, protectedProcedure } from "../index";
import { db } from "@app/db";
import { todo } from "@app/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const todoRouter = router({
  list: protectedProcedure.handler(async ({ context }) => {
    return await db
      .select()
      .from(todo)
      .where(eq(todo.userId, context.user.id))
      .orderBy(desc(todo.createdAt));
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      return await db
        .insert(todo)
        .values({
          text: input.text,
          userId: context.user.id,
        })
        .returning();
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input, context }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(and(eq(todo.id, input.id), eq(todo.userId, context.user.id)))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input, context }) => {
      return await db
        .delete(todo)
        .where(and(eq(todo.id, input.id), eq(todo.userId, context.user.id)));
    }),
});
