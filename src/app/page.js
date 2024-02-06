"use client"
import Blog from "@/components/Blog"
import BlogTable from "@/components/BlogTable"
import MainPage from "@/components/MainPage"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function Home() {
    const { data: session, status } = useSession()
    const [selectedFile, setSelectedFile] = useState(null)
    const [repoDetails, setRepoDetails] = useState({
        repository: null,
        filePath: null,
    })
    const [directory, setDirectory] = useState("src")
    const [githubContent, setGithubcontent] = useState({})
    const [blogContent, setBlogContent] = useState({ blogs: [], images: [] })
    const [blogActive, setBlogActive] = useState(false)
    const [updated, setUpdate] = useState(0)
    const [allRepos, setAllRepos] = useState([])
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    }
    useEffect(() => {
        if (session) {
            let f = async () => {
                let repos = await getFileContents(
                    `/api/getAllRepos?accessToken=${session.accessToken}&sessionName=${session.user.name}`
                )
                setAllRepos(repos)
            }
            f()
        }
    }, [session])

    const handleGithubRepoChoose = () => {
        let el = document.getElementById("gitModal")
        if (el == null) {
            return
        }
        el.showModal()
    }
    const handleRepoChosen = (dirChosen) => {
        if (dirChosen.filePath == "/") {
            dirChosen.filePath = ""
            localStorage.setItem("filePath", dirChosen.filePath + "json.txt")
            localStorage.setItem("currentRepository", dirChosen.repository)

            setRepoDetails({
                repository: dirChosen.repository,
                filePath: dirChosen.filePath + "json.txt",
            })
            return
        }
        localStorage.setItem("filePath", dirChosen.filePath + "/json.txt")
        console.log("from handleRepo", dirChosen)
        localStorage.setItem("currentRepository", dirChosen.repository)
        setRepoDetails({
            repository: dirChosen.repository,
            filePath: dirChosen.filePath + "/json.txt",
        })
    }
    useEffect(() => {
        if (!session) return
        let repository = localStorage.getItem("currentRepository")
        let path = localStorage.getItem("filePath")
        console.log("path and repository", repository, path)
        if (repository == undefined || path == undefined) {
            handleGithubRepoChoose()
        } else {
            setRepoDetails({ repository, filePath: path })
        }
    }, [allRepos])

    useEffect(() => {
        console.log("labas rytas 123", repoDetails)
        if (
            session &&
            repoDetails.repository !== null &&
            repoDetails.filePath !== null
        ) {
            let f = async () => {
                let contents = await getFileContents(
                    `/api/getFileContents?accessToken=${session.accessToken}&repoFullName=${session.user.name}/${repoDetails.repository}&filePath=${repoDetails.filePath}`
                )
                if (!contents) {
                    return
                }
                setBlogContent(contents)
                console.log("blogContenteset")
            }
            f()
        }
    }, [session, updated, repoDetails])

    function processFile(file) {
        if (file.type === "file" && file.content) {
            if (file.content.startsWith("{") || file.content.startsWith("[")) {
                try {
                    // Parse the content as JSON
                    file.content = JSON.parse(file.content)
                } catch (e) {}
            }
            // If it's not JSON or if there's an error, file.content remains unchanged
        } else if (file.type === "dir" && file.contents) {
            // If it's a directory, process each file/directory inside it
            file.contents.forEach(processFile)
        }
    }

    const getFileContents = async (url) => {
        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()
            try {
                const parsedData = JSON.parse(data)
                return parsedData
            } catch (error) {
                return data
            }
        } else {
            const errorData = await response.json()
            // Handle other errors
        }
    }

    const recurseThroughContent = (dirContents) => {
        if (dirContents.type == "file") {
            return false
        }
        if (dirContents.name === "blogs") {
            return dirContents
        }

        for (let i = 0; i < dirContents.contents.length; i++) {
            let innerDirContents = recurseThroughContent(
                dirContents.contents[i]
            )
            if (innerDirContents) return innerDirContents
        }
        return false
    }
    const updateBlogInGithub = async (id, blog) => {
        let content = JSON.parse(JSON.stringify(blogContent))
        content.blogs = content.blogs.map((i) => (id === i.id ? blog : i))
        const response = await fetch("/api/updateFile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: session.accessToken,
                username: session.user.name,
                repoName: repoDetails.repository,
                path: repoDetails.filePath,
                content: JSON.stringify(content),
                message: `Updating ${blog.title}`,
            }),
        })
        setUpdate((i) => i + 1)
        setBlogActive(false)
        const data = await response.json()
    }

    useEffect(() => {
        if (githubContent.type) {
            if (githubContent.name === "blogs") {
                setBlogContent(githubContent)
                return
            }
            setBlogContent(recurseThroughContent(githubContent))
        }
    }, [githubContent])
    useEffect(() => {}, [blogActive])
    const sellectBlog = (blog) => {
        setBlogActive(blog)
    }

    const createBlog = async (name) => {
        if (name === "") name = "blog"
        const json = JSON.parse(JSON.stringify(blogContent))
        json.blogs.push({
            title: name,
            components: [],
            published: false,
            id: uuidv4(),
        })
        const response = await fetch("/api/updateFile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: session.accessToken,
                username: session.user.name,
                repoName: repoDetails.repository,
                path: repoDetails.filePath,
                content: JSON.stringify(json),
                message: `Created json.txt`,
            }),
        })
        setBlogContent(json)
        const data = await response.json()
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (session) {
        // If a session exists, display user info and sign out button
        return (
            <MainPage
                session={session}
                handleRepoChosen={handleRepoChosen}
                handleGithubRepoChoose={handleGithubRepoChoose}
                repository={repoDetails.repository}
                allRepos={allRepos}
                sellectBlog={sellectBlog}
                createBlog={createBlog}
                blogContent={blogContent}
                blogActive={blogActive}
                updateBlogInGithub={updateBlogInGithub}
            />
        )
    }

    // If no session exists, display sign in button
    return (
        <div>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    )
}
