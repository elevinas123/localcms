"use client"
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const fetchGitHubData = async () => {
    const response = await fetch('/api/createRepository', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ accessToken: session.accessToken }),
    });
    const data = await response.json();
    console.log(data); // Do something with the GitHub data
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log(session)
    // If a session exists, display user info and sign out button
    return (
      <div>
        <button onClick={fetchGitHubData}>Fetch GitHub Data</button>
      </div>
    );
  }

  // If no session exists, display sign in button
  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}