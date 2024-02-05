import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa";
import { signOut } from 'next-auth/react';


export default function Navbar (props) {


    const [blogs, setBlogs] = useState([])
    

    useEffect(() => {
        console.log("blgos", props)
        if (props.blogContent.blogs) {
            setBlogs(props.blogContent.blogs.map((i, index)=> (
                <div key={index} onClick={() => props.sellectBlog(i.id)} className=" rounded-md text-white flex flex-row  text-sm mt-3 hover:cursor-pointer hover:bg-zinc-700">
                    <div className="ml-4">-</div>
                    <div className="ml-4">{i.title}</div>
                </div>
            )))
        }
    }, [props])

    return(
        <div className="flex flex-col w-72 h-screen   ">
            <div className="fixed h-screen flex flex-col justify-between  border-r border-r-zinc-600 pt-6 pl-4 pr-6">
                <div className="flex flex-col w-52 bg-zinc-800  h-full  ">
                    <div className="flex flex-row justify-between text-white">
                        <div className="text-xl">Content</div>
                        <div className="flex flex-col justify-center"><FaSearch /></div>
                    </div>
                    <div className="flex flex-col mt-8 text-gray-400">
                        <div>
                            <div className="text-sm flex flex-row justify-between ml-2">
                                <div onClick={() => props.sellectBlog(false)} className=" cursor-pointer flex flex-col justify-center items-center ">BLOGS</div>
                                <div className="flex flex-row bg-zinc-600 rounded-md items-center justify-center  w-8 h-8">{blogs.length}</div>
                            </div>
                            
                            {blogs}
                        </div>
                    </div>
                </div>
                <button onClick={props.getStructureOfDirectory}>Get directory contents</button>
                <div className="flex flex-col">
                    <div className="ml-2">Current repo:</div>
                    <button className="hover:bg-zinc-600 w-fit pl-2 pr-2 rounded-md cursor-pointer min-w-2 min-h-2" onClick={props.handleGithubRepoChoose}>{props.repository}</button>
                </div>
                <button className="text-white mb-6 mt-4 justify-start flex flex-row ml-2 border rounded-md p-2 w-20 hover:bg-zinc-700" onClick={() => signOut( )}>signOut</button>
            </div>
        </div>
    )
}