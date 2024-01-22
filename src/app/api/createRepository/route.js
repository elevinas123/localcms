import { getSession } from "next-auth/react";

export async function POST(req) {
    const { accessToken } = await req.json()
    console.log("session", accessToken)
    if (!accessToken) {
      throw new Error("Error:")
    }

    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "my-new-repo",
        description: "This is your first repository",
        private: false,
        auto_init: true,
      }),
    });
    
    return new Response(JSON.stringify(await response.json()))
}