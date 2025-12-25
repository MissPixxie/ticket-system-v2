import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { env } from "~/env";
import { db } from "~/server/db";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(db, {
    provider: "sqlite", // or "sqlite" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      }
    }
  },
  databaseHooks: {
    account: {
      update: {
        after: async (account) => {
          console.log(account);

          await db.account.update({
            where: { id: account.id },
            data: {
              providerId: account.providerId ?? "missing"
            }
          })
        }
      }
    }
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/github",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
