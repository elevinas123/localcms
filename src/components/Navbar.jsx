import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import Options from "./Options"

export default function Navbar(props) {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        if (props.blogContent.blogs) {
            setBlogs(
                props.blogContent.blogs.map((i, index) => (
                    <div
                        key={index}
                        onClick={() => props.sellectBlog(i.id)}
                        className=" mt-3 flex flex-row rounded-md  text-sm text-white hover:cursor-pointer hover:bg-zinc-700"
                    >
                        <div className="ml-4">-</div>
                        <div className="ml-4">{i.title}</div>
                    </div>
                ))
            )
        }
    }, [props])

    return (
        <div className="flex h-screen w-72 flex-col   ">
            <div className="fixed flex h-screen flex-col justify-between  border-r border-r-zinc-600 pl-4 pr-6 pt-6">
                <div className="flex h-full w-52 flex-col  bg-zinc-800  ">
                    <div className="flex flex-row justify-between text-white">
                        <div className="text-xl">Content</div>
                        <div className="flex flex-col justify-center">
                            <FaSearch />
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col text-gray-400">
                        <div>
                            <div className="ml-2 flex flex-row justify-between text-sm">
                                <div
                                    onClick={() => props.sellectBlog(false)}
                                    className=" flex cursor-pointer flex-col items-center justify-center "
                                >
                                    BLOGS
                                </div>
                                <div className="flex h-8 w-8 flex-row items-center justify-center  rounded-md bg-zinc-600">
                                    {blogs.length}
                                </div>
                            </div>

                            {blogs}
                        </div>
                    </div>
                </div>
                <Options session={props.session} repository={props.repository} handleGithubRepoChoose={props.handleGithubRepoChoose} />
            </div>
        </div>
    )
}
