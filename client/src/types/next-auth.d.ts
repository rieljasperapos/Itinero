import NextAuth from "next-auth";
import JWT from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      email: string; // Add custom properties if needed
      accessToken: string;
    },
  }

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    accessToken;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    accessToken: string;
  }
}
