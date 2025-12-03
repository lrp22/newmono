import { createAuthClient } from "better-auth/react";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
// 👇 Update this import to use the Client type
import type { AppRouterClient } from "api/routers";

const API_URL = "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: API_URL,
});

const link = new RPCLink({
  url: `${API_URL}/api`,
  fetch: (url, init) => {
    return fetch(url, { ...init, credentials: "include" });
  },
});

// 👇 Use AppRouterClient here
const client = createORPCClient<AppRouterClient>(link);
export const orpc = createTanstackQueryUtils(client);
