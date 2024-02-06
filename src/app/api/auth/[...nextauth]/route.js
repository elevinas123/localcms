// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "repo, read:user, user:email",
                },
            },
        }),
        // ...add more providers here if needed
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Forward the OAuth access token to the JWT token
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // Forward the OAuth access token to the session
            session.accessToken = token.accessToken
            return session
        },
    },
    // Add your NextAuth.js configuration options here
})

export { handler as GET, handler as POST }
