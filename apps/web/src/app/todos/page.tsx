"use client";

import { useState } from "react";
// 1. Import hooks from TanStack Query
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc"; // Import queryClient for invalidation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";

export default function TodosPage() {
  const [text, setText] = useState("");

  // 2. Use standard useQuery with orpc options
  const { data: todos, isLoading } = useQuery(orpc.todo.list.queryOptions());

  // 3. Use standard useMutation with orpc options
  const createTodo = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        setText("");
        // Invalidate using the queryClient
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
    })
  );

  const toggleTodo = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
    })
  );

  const deleteTodo = useMutation(
    orpc.todo.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) createTodo.mutate({ text });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
            />
            <Button type="submit" disabled={createTodo.isPending}>
              {createTodo.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </form>

          {isLoading ? (
            <div className="text-center p-4">
              <Loader2 className="animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-3">
              {todos?.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      // Note: shadcn Checkbox returns literal true/false, or "indeterminate"
                      onCheckedChange={(checked) =>
                        toggleTodo.mutate({ id: todo.id, completed: !!checked })
                      }
                    />
                    <span
                      className={
                        todo.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo.mutate({ id: todo.id })}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {todos?.length === 0 && (
                <p className="text-center text-gray-500">No todos yet!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
