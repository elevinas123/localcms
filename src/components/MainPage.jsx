import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import RepositoryComponent from "./RepositoryComponent"

import Blog from "./Blog";
import TableView from "./TableView";


export default function MainPage (props) {
    
    const [repoChosen, setRepoChosen] = useState("")
    const selectedBlog = props.blogContent.blogs.find(blog => blog.id === props.blogActive);
    const [noRepoChosen, setNoRepoChosen] = useState(false)
    const [repoContents, setRepoContents] = useState([])
    const [repos, setRepos] = useState([])

    const handleChoose = () => {
        if (!repoChosen) {
            setNoRepoChosen(true)
            return
        }
        props.handleRepoChosen(repoChosen)
    }

    return (
        <div>
            <div className="relative flex flex-row bg-zinc-800">
                <Navbar {...props}/>
                <dialog id="gitModal" className="modal">
                    <div className="modal-box h-96 flex flex-col justify-between bg-zinc-700">
                        <div>
                            <h3 className="font-bold text-lg flex flex-row justify-center">Choose where your json.txt file is located or where to crete it</h3>
                            <div className="flex flex-row justify-center">
                                <div className="flex flex-col w-full justify-center">
                                    {props.allRepos.map((i, index) => <RepositoryComponent key={index} repo={i} session={props.session} show={true} name={i} path={"/"} />)}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action border-t   w-full">
                            <form method="dialog flex flex-row justify-between bg-red-500 w-full">
                                <button onClick={() => console.log("hi")} className="btn bg-zinc-600 hover:bg-zinc-700 text-white">Done</button>
                                <button onClick={handleChoose} className="btn bg-zinc-600 hover:bg-zinc-700 text-white">Done</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                {props.blogActive?<Blog blog={selectedBlog} updateBlogInGithub={props.updateBlogInGithub}/>:<TableView sellectBlog={props.sellectBlog} createBlog={props.createBlog} blogContent={props.blogContent} />}
            </div>
        </div>
    )
}