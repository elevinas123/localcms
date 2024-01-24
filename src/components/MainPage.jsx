import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
export default function MainPage (props) {
    
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [images, setImages] = useState("")

    useEffect(() => {
        if (props.blogActive.content.name) setTitle(props.blogActive.content.name)
        if (props.blogActive.content.text) setText(props.blogActive.content.text)
        if (props.blogActive.content.images) setImages(props.blogActive.content.images)
        
    }, [props])

    const updateBlog = () => {
        let blog = {
            name: title,
            text: text,
            images: images,
        }
        props.updateBlogInGithub(blog)
    }

    return (
        <div>
            <div className="flex flex-row">
                <Navbar {...props}/>
                <div className="flex flex-col w-screen pt-8 pr-12 pl-12 bg-zinc-800 text-white">
                    <div className="flex flex-row justify-between">
                        <div className="text-3xl flex flex-col justify-center">{title}</div>
                        <div className="flex flex-row ">
                            <button className="flex flex-row justify-center items-center rounded-sm bg-zinc-600 mr-2 border p-2" >Delete</button>
                            <button className="flex flex-row justify-center items-center rounded-sm bg-zinc-600 border p-2" onClick={updateBlog} >Save</button>
                        </div>
                    </div>
                    <div className="bg-zinc-700 mt-10 p-6 flex flex-row">
                        <div className="flex flex-col">
                            <div className="flex flex-row w-96">
                                <div className="w-full flex flex-col">
                                    <div className="text-sm">Title</div>
                                    <input className="appearance-none rounded-sm p-2 w-auto bg-zinc-800 border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                            </div>
                            <div className="flex flex-row w-96 mt-4">
                                <div className="w-full flex flex-col">
                                    <div className="text-sm">Image</div>
                                    <div className="flex flex-row w-full  bg-zinc-800 rounded-sm justify-center border">
                                        <div className="relative h-auto w-64 mt-4 pb-2">
                                            <img src="https://picsum.photos/400/200" alt="Random Image" />
                                            <div className="flex flex-row justify-center">Paella in Valencia</div>
                                            <div className="absolute flex flex-row top-20 left-16">
                                                <button className="flex flex-row justify-center items-center w-8 h-8 bg-zinc-700 ml-2 rounded-sm text-sm shadow-lg active:bg-zinc-500 " ><FaPlus /></button>
                                                <button className="flex flex-row justify-center items-center w-8 h-8 bg-zinc-700 ml-2 rounded-sm text-sm shadow-lg active:bg-zinc-500" ><FaTrash /></button>
                                                <button className="flex flex-row justify-center items-center w-8 h-8 bg-zinc-700 ml-2 rounded-sm text-sm shadow-lg active:bg-zinc-500" ><FaPencilAlt /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col ml-10">
                            <div className="text-sm">Blog Text</div>
                            <textarea className="appearance-none rounded-sm p-2 w-auto bg-zinc-800 border resize" value={text} onChange={(e) => setText(e.target.value)} ></textarea>
                        </div>
                        
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}