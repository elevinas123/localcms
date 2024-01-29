import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";





export default function TableView(props) {


    const [blogs, setBlogs] = useState([])


    useEffect(() => {
        setBlogs(props.blogContent.blogs.map((i, index) => (
            <div onClick={() => props.sellectBlog(i.id)} key={index} className="flex flex-row justify-between border-t pt-4 pb-4 hover:bg-zinc-500 hover:cursor-pointer rounded-md ">
                <div className=" w-full ml-2" >{index}</div>
                <div className=" w-full" >{i.title}</div>
                <div className=" w-full" >{i.published?"PUBLISHED":"DRAFT"}</div>
            </div>
        )))
    }, [props])

    return (
        <div  className="flex flex-col w-full p-10 text-white">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-white text-3xl">Blogs</div>
                    <div className="text-zinc-500">4 entries found</div>
                </div>
                <button onClick={props.createBlog} className="flex flex-row p-1 h-8 border rounded-md text-sm ">
                    <div className="ml-2 flex flex-col justify-center  h-full "><FaPlus /></div><div className="  flex flex-col h-full justify-center  ml-2 mr-2">Create new entry</div>
                </button>
            </div>
            <div className="flex flex-col mt-10 bg-zinc-600 w-full rounded-md pt-4 pl-4 pr-4 border">
               <div className="flex flex-row justify-between mb-4">
                    <div className=" w-full ml-2">ID</div>
                    <div className=" w-full">TITLE</div>
                    <div className=" w-full">STATE</div>
               </div>
               {blogs}
               
            </div>
        </div>
    )
}