import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AppRouterClient } from "@app/api/routers"; // Ensure this matches your package export

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Query Error:", error);
      // In the future, you can add toast notifications here:
      // toast.error(`Error: ${error.message}`);
    },
  }),
});

export const link = new RPCLink({
  url: `${BASE_URL}/api`, // Note: Repo B used /rpc, we are using /api based on your server setup
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include", // Critical for Auth Cookies
    });
  },
  headers: async () => {
    // 🪄 MAGIC: If running on server (SSR), forward the browser headers
    if (typeof window === "undefined") {
      const { headers } = await import("next/headers");
      return Object.fromEntries(await headers());
    }
    // If on client, browser handles cookies automatically
    return {};
  },
});

const client = createORPCClient<AppRouterClient>(link);

export const orpc = createTanstackQueryUtils(client);
