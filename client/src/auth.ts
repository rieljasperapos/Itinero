import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Step 1: Send a POST request to your Express.js API
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );

          // Step 2: Extract the user and access token from the response
          const user = response.data.userResponse;
          const accessToken = response.data.userResponse.accessToken;

          // Step 3: Return the user data with the token to NextAuth
          if (user && accessToken) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              accessToken: accessToken,
            };
          }

          return null;
        } catch (err: any) {
          throw new Error("Authentication failed: " + err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email as string;
        token.accessToken = user.accessToken;
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name as string;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      
      return session;
    },
  },
});
