"use client"
import Blog from "@/components/Blog";
import BlogTable from "@/components/BlogTable";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [directory, setDirectory] = useState('');
  const [githubContent, setGithubcontent] = useState({})
  const [blogContent, setBlogContent] = useState({})
  const [blogActive, setBlogActive] = useState({name: ""})
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
          path: 'src/blogs/blog3/images/' + selectedFile.name,
          content: base64content,
          message: `Adding ${selectedFile.name}`,
        }),
      });

      const data = await response.json();
      console.log(data); // Do something with the GitHub data
    };
  };

  const getFileContents = async () => {
    const response = await fetch(`/api/getFileContents?accessToken=${(session.accessToken)}&repoFullName=${session.user.name}/my-new-repo&filePath=${encodeURIComponent(filePath)}`);

    if (response.ok) {
      const data = await response.json();
      console.log('File content:', data.content);
      // Do something with the file content
    } else if (response.status === 404) {
      console.log('File not found');
      // Handle file not found
    } else {
      const errorData = await response.json();
      console.error('Failed to get file content:', errorData.error);
      // Handle other errors
    }
  };
  const getStructureOfDirectory = async () => {
    console.log(directory)
    const response = await fetch(`/api/getContentFromPath?accessToken=${(session.accessToken)}&repoFullName=${session.user.name}/my-new-repo&directory=${directory}`);
    if (response.ok) {
      const data = await response.json();
      setGithubcontent(data)
      // Do something with the file content
    } else if (response.status === 404) {
      console.log('File not found');
      // Handle file not found
    } else {
      const errorData = await response.json();
      console.error('Failed to get file content:', errorData.error);
      // Handle other errors
    }
  }
  const recurseThroughContent = (dirContents) => {
    console.log("dir", dirContents)
    if (dirContents.type == "file") {
      return false
    }
    if (dirContents.name === "blogs") {
      return dirContents
    }
    
    for(let i=0; i<dirContents.contents.length; i++) {
      let innerDirContents = recurseThroughContent(dirContents.contents[i])
      if (innerDirContents) return innerDirContents
    }
    return false
  }
  useEffect(() => {
    if (githubContent.type) {
      if (githubContent.name === "blogs") {
        setBlogContent(githubContent.content)
        return
      } 
      setBlogContent(recurseThroughContent(githubContent))

    }
  }, [githubContent])
  useEffect(() => {
    console.log("sellected blog", blogActive)
  }, [blogActive])
  const sellectBlog = (blog) => {
    setBlogActive(blog)
  }
  const goBack = () => {
    setBlogActive({name: ""})
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (blogActive.name !== "") {
    return(
      <div className="flex flex-col bg-slate-200">
        <button onClick={goBack}>X</button>
        <Blog {...blogActive} />
      </div>
    )
  }

  if (session) {
    console.log(session)
    // If a session exists, display user info and sign out button
    return (
      <div className="flex flex-col bg-slate-200 justify-start items-start p-10">
        <input type="file" onChange={handleFileChange} accept="image/png" />
        <button onClick={uploadFile}>Upload File</button>
        <input className="mt-4" type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} placeholder="Enter file path" />
        <button onClick={getFileContents}>Get File Contents</button>
        <input className="mt-4" type="text" value={directory} onChange={(e) => setDirectory(e.target.value)} placeholder="Enter file path" />
        <button onClick={getStructureOfDirectory}>Get directory contents</button>
        <BlogTable sellectBlog={sellectBlog} blogContent={blogContent} />



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