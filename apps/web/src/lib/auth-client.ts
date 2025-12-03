import { createAuthClient } from "better-auth/react";
// We import the type from our auth package to get type inference for the client
import type { auth } from "@app/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    // This syncs the client types with your specific DB schema
    inferAdditionalFields<typeof auth>(),
  ],
});
