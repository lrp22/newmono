import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import type { auth } from "@app/auth";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3001";

// Helper to safely get the scheme string
const scheme = Constants.expoConfig?.scheme;
const resolvedScheme = Array.isArray(scheme) ? scheme[0] : scheme;

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    expoClient({
      scheme: resolvedScheme || "mobile", // Now guaranteed to be string
      storage: SecureStore,
    }),
  ],
});
