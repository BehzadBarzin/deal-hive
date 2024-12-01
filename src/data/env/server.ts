import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Uses @t3-oss/env-nextjs and zod to load, validate, and add typed environment variables to the `env` object below.
 * The `env` object in this file contains only variables for the server side.
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
});
