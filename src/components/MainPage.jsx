import { useState, useEffect } from "react";
import Navbar from "./Navbar"

import Blog from "./Blog";
import TableView from "./TableView";


export default function MainPage (props) {
    
    const [repoChosen, setRepoChosen] = useState("")
    const selectedBlog = props.blogContent.blogs.find(blog => blog.id === props.blogActive);
    const [noRepoChosen, setNoRepoChosen] = useState(false)
    const [repos, setRepos] = useState([])
    useEffect(() => {
        let r = props.allRepos.map((i, index) => <button key={index} onClick={() => setRepoChosen(i)} className="hover:bg-zinc-600 rounded-md pl-2 pr-2 bg-zinc-700 mt-2">{i}</button>)
        setRepos(r)
    }, [props])

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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Choose a repo</h3>
                        <div className="flex flex-col w-48">
                            {repos}
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <div>Choose a repo</div>
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