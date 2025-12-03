import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@app/db"; // Note the new name
import * as schema from "@app/db/schema";
import { expo } from "@better-auth/expo"; // New plugin

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Essential for mobile + web to work on same backend
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "exp://", // Allow Expo Go
    "mobile://", // Allow your production mobile app scheme
  ],
  advanced: {
    // Repo B's cookie settings are safer for cross-origin
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true, // Requires https in prod, but fine for localhost if handled right
      httpOnly: true,
    },
  },
  plugins: [expo()], // This handles the mobile headers automatically
});
