import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import RepositoryComponent from "./RepositoryComponent"

import Blog from "./Blog"
import TableView from "./TableView"
import FileSearchModal from "./FileSearchModal"

export default function MainPage(props) {
    const [repoChosen, setRepoChosen] = useState("")
    const selectedBlog = props.blogContent.blogs.find((blog) => blog.id === props.blogActive)
    const [noRepoChosen, setNoRepoChosen] = useState(false)
    const [repoContents, setRepoContents] = useState([])
    const [repos, setRepos] = useState([])

    return (
        <div>
            <div className="relative flex flex-row bg-zinc-800">
                <Navbar {...props} />
                <FileSearchModal
                    filePath={props.filePath}
                    repository={props.repository}
                    session={props.session}
                    allRepos={props.allRepos}
                    handleRepoChosen={props.handleRepoChosen}
                />
                {props.blogActive ? (
                    <Blog blog={selectedBlog} updateBlogInGithub={props.updateBlogInGithub} deleteBlog={props.deleteBlog} />
                ) : (
                        <TableView
                        sellectBlog={props.sellectBlog}
                        createBlog={props.createBlog}
                        blogContent={props.blogContent}
                        updateBlog={props.updateBlog}
                        deleteBlog={props.deleteBlog}
                    />
                )}
            </div>
        </div>
    )
}
