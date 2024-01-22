"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    console.log(selectedFile)
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const base64content = reader.result.split(',')[1]; // Remove the Data URL part like "data:image/png;base64,"

      const response = await fetch('/api/addFileToFolder', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
          username: session.user.name,
          repoName: "my-new-repo",
          path: 'src/pages/images/' + selectedFile.name,
          content: base64content,
          message: `Adding ${selectedFile.name}`,
        }),
      });

      const data = await response.json();
      console.log(data); // Do something with the GitHub data
    };
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log(session)
    // If a session exists, display user info and sign out button
    return (
      <div>
        <input type="file" onChange={handleFileChange} accept="image/png" />
        <button onClick={uploadFile}>Upload File</button>
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