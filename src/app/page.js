"use client"
import Blog from "@/components/Blog";
import BlogTable from "@/components/BlogTable";
import MainPage from "@/components/MainPage";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState('src/blogs/json.txt');
  const [directory, setDirectory] = useState('src/blogs');
  const [githubContent, setGithubcontent] = useState({})
  const [blogContent, setBlogContent] = useState({blogs: [], images:[]})
  const [blogActive, setBlogActive] = useState(false)
  const [updated, setUpdate] = useState(0)
  const [repository, setRepository] = useState(false)
  const [allRepos, setAllRepos] = useState([])
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {

    if (session) {
      let f = async() => {
        let repos = await getFileContents(`/api/getAllRepos?accessToken=${(session.accessToken)}&sessionName=${session.user.name}`)
        setAllRepos(repos)
      }
      f()
    }
  }, [session])


  const handleGithubRepoChoose = () => {
    let el = document.getElementById('gitModal')
      if (el == null){
        return
      }
    console.log("element", el)
    el.showModal()
  }
  const handleRepoChosen = (repoName) => {
    localStorage.setItem("currentRepo", repoName)
    setRepository(repoName)
  }
  useEffect(() => {
    if(!session) return
    let repo = localStorage.getItem("currentRepo")
    console.log("repository", repo)
    if (repo == undefined) {
      
      handleGithubRepoChoose()
    }else {
      setRepository(repo)

    }
  }, [allRepos])

  useEffect(() => {
    console.log("seesion", session)
    if (session && repository) {
      let f = async() => {
        let contents = await getFileContents(`/api/getFileContents?accessToken=${(session.accessToken)}&repoFullName=${session.user.name}/${repository}&filePath=${filePath}`)
        if (!contents) {
          return
        }
        setBlogContent(contents)
      }
      f()
    }
  }, [session, updated, repository])
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
          path: filePath + selectedFile.name,
          content: base64content,
          message: `Adding ${selectedFile.name}`,
        }),
      });

      const data = await response.json();
      console.log(data); // Do something with the GitHub data
    };
  };
  function processFile(file) {
    if (file.type === 'file' && file.content) {
        if (file.content.startsWith('{') || file.content.startsWith('[')) {
            try {
                // Parse the content as JSON
                file.content = JSON.parse(file.content);
            } catch (e) {
                console.error('Error parsing JSON content', e);
            }
        }
        // If it's not JSON or if there's an error, file.content remains unchanged
    } else if (file.type === 'dir' && file.contents) {
        // If it's a directory, process each file/directory inside it
        file.contents.forEach(processFile);
    }
}


  const getFileContents = async (url) => {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log("data", data)
      try{
        const parsedData= JSON.parse(data)
        return parsedData
      } catch (error){
        console.log(error)
        return data
      }

    }  else {
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
      console.log("Data got from github", data)
      data.contents.forEach(processFile);
      console.log("Data got from github", data)
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
  const updateBlogInGithub = async (id, blog) => {
      console.log("blogas, kuri siunciame", blog)
      let content = JSON.parse(JSON.stringify(blogContent))
      content.blogs = content.blogs.map((i) => id===i.id?blog:i)
      const response = await fetch('/api/updateFile', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
          username: session.user.name,
          repoName: "my-new-repo",
          path: "src/blogs/json.txt"
          ,
          content: JSON.stringify(content),
          message: `Updating ${blog.name}`,
        }),
      });
      setUpdate(i => i+1)
      setBlogActive(false)
      const data = await response.json();
      console.log(data); // Do something with the GitHub data
    };

  useEffect(() => {
    if (githubContent.type) {
      console.log("github", githubContent)
      if (githubContent.name === "blogs") {
        setBlogContent(githubContent)
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
  const setGithubRepo = (repo) => {

  }
  const createBlog = async(name) => {

    if (name === "") name = "blog"
    const json = JSON.parse(JSON.stringify(blogContent))
    json.blogs.push({title: name, components: [], published: false, id: uuidv4()})
    console.log("json pushing")
    const response = await fetch('/api/updateFile', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessToken: session.accessToken,
        username: session.user.name,
        repoName: "my-new-repo",
        path: filePath,
        content: JSON.stringify(json),
        message: `Updated json.txt`,
      }),
    });
    setBlogContent(json)
    const data = await response.json();
    console.log(data); // Do something with the GitHub data
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  

  if (session) {
    console.log(session)
    // If a session exists, display user info and sign out button
    return(
      <MainPage handleRepoChosen={handleRepoChosen} handleGithubRepoChoose={handleGithubRepoChoose} repository={repository} allRepos={allRepos} sellectBlog={sellectBlog} createBlog={createBlog} blogContent={blogContent} blogActive={blogActive} updateBlogInGithub={updateBlogInGithub} />
    )


    return (
      <div className="flex flex-col bg-slate-200 justify-start items-start p-10">
        <input type="file" onChange={handleFileChange} accept="image/png" />
        <button onClick={uploadFile}>Upload File</button>
        <input className="mt-4" type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} placeholder="Enter file path" />
        <button onClick={getFileContents}>Get File Contents</button>
        <input className="mt-4" type="text" value={directory} onChange={(e) => setDirectory(e.target.value)} placeholder="Enter file path" />
        <button onClick={getStructureOfDirectory}>Get directory contents</button>
        <BlogTable sellectBlog={sellectBlog} blogContent={blogContent} />
        <button onClick={() => signOut( )}>signOut</button>



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