import prisma from "../../../lib/prisma.ts"
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require("bcrypt");

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60
  },
  secret: "sadasddsadsadsadsa",
  providers: [
    CredentialsProvider({
      credentials: {
        username: {type:"text"},
        password: {type:"password"},
      },
      authorize: async (credentials) => {
        const userraw = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });



        const result = bcrypt.compareSync(
          credentials.password,
          userraw.password
        );

        if (userraw !== null && result) {
          const user = {
            id: userraw.id,
            username: userraw.username,
            isActive: userraw.isActive,
            role: userraw.role,
          };

          console.log(user)


          return user;
        } else {
          return null;
        }

      },
      
      

    })
    
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  
})

