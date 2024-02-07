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
        if (session && repoDetails.repository !== null && repoDetails.filePath !== null) {
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

    const sellectBlog = (blog) => {
        setBlogActive(blog)
    }
    const updateGithub = async (repository, filePath, content) => {
        setBlogContent(content)
        setBlogActive(false)
        const response = await fetch("/api/updateFile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: session.accessToken,
                username: session.user.name,
                repoName: repository,
                path: filePath,
                content: JSON.stringify(content),
                message: `Created json.txt`,
            }),
        })
        if (!response.ok) throw new Error(response.error)
        console.log("cia")
        return await response.json()
    }
    const updateBlogInGithub = async (id, newBlog) => {
        const newBlogContent = {
            ...blogContent,
            blogs: blogContent.blogs.map((blog) => (blog.id === id ? newBlog : blog)),
        }
        console.log("new", newBlogContent)
        console.log("old", blogContent)
        const data = updateGithub(repoDetails.repository, repoDetails.filePath, newBlogContent)
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
        console.log("json", json)
        const data = updateGithub(repoDetails.repository, repoDetails.filePath, json)
    }
    const deleteBlog = async (id) => {
        const newBlogContent = {
            ...blogContent,
            blogs: blogContent.blogs.filter((blog) => blog.id !== id),
        }
        console.log("deletedData", newBlogContent)
        const data = await updateGithub(repoDetails.repository, repoDetails.filePath, newBlogContent)
    }
    const updateBlog = async (id, name) => {
        const newBlogContent = {
            ...blogContent,
            blogs: blogContent.blogs.map((blog) => (blog.id === id ? { ...blog, title: name } : blog)),
        }
        console.log(blogContent, id, name)
        // Update the state
        const data = updateGithub(repoDetails.repository, repoDetails.filePath, newBlogContent)
    }

    useEffect(() => {
        console.log("is blogcontentnsa", blogContent)
    }, [blogContent])
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
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
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
