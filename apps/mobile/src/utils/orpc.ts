import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AppRouterClient } from "@app/api/routers";
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3001";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.log("Query Error:", error);
    },
  }),
});

export const link = new RPCLink({
  url: `${BASE_URL}/api`,
  // 🪄 MAGIC: Inject the cookie manually
  headers: () => {
    const headers = new Map<string, string>();
    const cookie = authClient.getCookie(); // Get token from SecureStore

    if (cookie) {
      headers.set("Cookie", cookie);
    }

    return Object.fromEntries(headers);
  },
});

const client = createORPCClient<AppRouterClient>(link);

export const orpc = createTanstackQueryUtils(client);
