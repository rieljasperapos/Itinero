import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Make a POST request to your Express.js API
          const response = await axios.post("http://localhost:3000/login", {
              username: credentials?.username,
              password: credentials?.password,
          });

          // Extract the user from the response
          const user = response.data?.user;

          if (user) {
            // Remove sensitive data like password before returning
            const { password, ...safeUser } = user;
            return safeUser; // Return safe user data to NextAuth
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
});
