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
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          console.log("API Base URL:", apiBaseUrl);
          // Step 1: Send a POST request to your Express.js API
          const response = await axios.post(
            `${apiBaseUrl}/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
          );

          // Step 2: Extract the user and access token from the response
          const user = response.data.userResponse;
          const accessToken = response.data.userResponse.accessToken; // Assuming the token is here

          // Log the user object to verify the data
          console.log("USER IS ", user);

          // Step 3: Return the user data with the token to NextAuth
          if (user && accessToken) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              accessToken: accessToken, // Pass the access token to the callback
            };
          }

          return null; // If no user or access token, return null
        } catch (err: any) {
          throw new Error("Authentication failed: " + err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Check if user and accessToken are correctly passed
        console.log("User in JWT callback:", user);
  
        token.id = user.id as string;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email as string;
        token.accessToken = user.accessToken; // Ensure accessToken is correctly assigned to the token
      }

      // Trigger condition for updates from the frontend
    if (trigger === "update") {
      return { ...token, ...session.user}
    }
  
      console.log("Token in JWT callback:", token); // Log to check the token
      return token;
    },
  
    async session({ session, token }) {
      // Check if the token contains accessToken
      console.log("Session callback - token:", token);
  
      // Transfer data from the token into the session object
      session.user.id = token.id;
      session.user.name = token.name as string;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken; // Ensure accessToken is passed to session
  
      console.log("Session callback - session:", session); // Log session to check
      return session;
    }
  }
});
