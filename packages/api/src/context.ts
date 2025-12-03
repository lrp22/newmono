import { auth } from "@app/auth";
import { fromNodeHeaders } from "better-auth/node";

// 1. Infer the exact return type of getSession
type GetSessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>;

// 2. Define the parts. getSession returns { session: ..., user: ... } | null
type Session = NonNullable<GetSessionResponse>["session"];
type User = NonNullable<GetSessionResponse>["user"];

export type Context = {
  session: Session | null;
  user: User | null;
  req?: any;
};

export const createContext = async ({
  req,
  res,
}: {
  req: any;
  res: any;
}): Promise<Context> => {
  const sessionData = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return {
    session: sessionData?.session || null,
    user: sessionData?.user || null,
    req,
  };
};
