import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"

export default function TableView(props) {
    const [blogs, setBlogs] = useState([])
    const [blogName, setBlogName] = useState("")

    useEffect(() => {
        setBlogs(
            props.blogContent.blogs.map((i, index) => (
                <div
                    onClick={() => props.sellectBlog(i.id)}
                    key={index}
                    className="flex flex-row justify-between rounded-md border-t pb-4 pt-4 hover:cursor-pointer hover:bg-zinc-500 "
                >
                    <div className=" ml-2 w-full">{index}</div>
                    <div className=" w-full">{i.title}</div>
                    <div className=" w-full">{i.published ? "PUBLISHED" : "DRAFT"}</div>
                </div>
            ))
        )
    }, [props])

    return (
        <div className="flex w-full flex-col p-10 text-white">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-3xl text-white">Blogs</div>
                    <div className="text-zinc-500">4 entries found</div>
                </div>
                <button
                    onClick={() => document.getElementById("my_modal_1").showModal()}
                    className="flex h-8 flex-row rounded-md border p-1 text-sm "
                >
                    <div className="ml-2 flex h-full flex-col  justify-center ">
                        <FaPlus />
                    </div>
                    <div className="  ml-2 mr-2 flex h-full  flex-col justify-center">Create new entry</div>
                </button>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">What should the blog be named?</h3>
                        <input
                            placeholder="Write here"
                            className=" mt-2 w-auto appearance-none rounded-sm border bg-zinc-800 p-2"
                            value={blogName}
                            onChange={(e) => setBlogName(e.target.value)}
                        />
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button
                                    onClick={() => props.createBlog(blogName)}
                                    className="btn bg-zinc-600 text-white hover:bg-zinc-700"
                                >
                                    Done
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div className="mt-10 flex w-full flex-col rounded-md border bg-zinc-600 pl-4 pr-4 pt-4">
                <div className="mb-4 flex flex-row justify-between">
                    <div className=" ml-2 w-full">ID</div>
                    <div className=" w-full">TITLE</div>
                    <div className=" w-full">STATE</div>
                </div>
                {blogs}
            </div>
        </div>
    )
}
