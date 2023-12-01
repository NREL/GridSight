import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const auth =  NextAuth({
    providers: [
      CredentialsProvider({
        name: "Credentials",

        credentials: {
          username: {label: "Username", type:"text", },
          password: {label: "Password", type: "password"},

        },

        async authorize(credentials, req) {

          const user = { id: "1", name: credentials?.username}

          if ( credentials?.username == process.env.ADMIN_USER) {

            if (credentials?.password == process.env.ADMIN_PASS){
              return user
            }
            else{
              return null
            }
            // Any object returned will be saved in `user` property of the JWT
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
          }
        }

      }),
    ],
    callbacks: {
      async jwt({ token }) {
        token.userRole = "admin"
        return token
      },
    },
  }
)


export {auth as GET, auth as POST}