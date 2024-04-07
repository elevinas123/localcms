import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa";

export default function TableView(props) {
    const [blogs, setBlogs] = useState([]);
    const [updatedBlogId, setUpdatedBlogId] = useState("");
    const [blogName, setBlogName] = useState("");

    const updateBlog = (id) => {
        setUpdatedBlogId(id);
        const el = document.getElementById("my_modal_1");
        if (el == null) {
            return;
        }
        el.showModal();
    };

    const handleCreation = () => {
        setUpdatedBlogId("new");
        document.getElementById("my_modal_1").showModal();
    };

    const handleModalSubmit = () => {
        if (updatedBlogId === "new") {
            props.createBlog(blogName);
        } else {
            props.updateBlog(updatedBlogId, blogName);
        }
    };

    const handleDelete = (id) => {
        props.deleteBlog(id);
    };

    useEffect(() => {
        setBlogs(props.blogContent.blogs);
    }, [props]);

    return (
        <div className="flex w-full flex-col p-10 text-white">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-3xl text-white">Blogs</div>
                    <div className="text-zinc-500">
                        <span>{blogs.length}</span> entries found
                    </div>
                </div>
                <button onClick={handleCreation} className="flex h-8 flex-row rounded-md border p-1 text-sm ">
                    <FaPlus />
                    <div className="ml-2 mr-2">Create new entry</div>
                </button>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">What should the blog be named?</h3>
                        <input
                            placeholder="Write here"
                            className="mt-2 w-auto appearance-none rounded-sm border bg-zinc-800 p-2"
                            value={blogName}
                            onChange={(e) => setBlogName(e.target.value)}
                        />
                        <div className="modal-action">
                            <form method="dialog">
                                <button
                                    onClick={handleModalSubmit}
                                    className="btn bg-zinc-600 text-white hover:bg-zinc-700"
                                >
                                    Done
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <table className="mt-10 w-full rounded-md border bg-zinc-600">
                <thead>
                    <tr className="text-left">
                        <th className="p-4">ID</th>
                        <th className="p-4">TITLE</th>
                        <th className="p-4">STATE</th>
                        <th className="p-4">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, index) => (
                        <tr
                            key={index}
                            className="hover:bg-zinc-500 cursor-pointer"
                            onClick={() => props.sellectBlog(blog.id)}
                        >
                            <td className="p-4">{blog.id}</td>
                            <td className="p-4">{blog.title}</td>
                            <td className="p-4">{blog.published ? "PUBLISHED" : "DRAFT"}</td>
                            <td className="p-4">
                                <button
                                    className="mr-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateBlog(blog.id);
                                    }}
                                >
                                    <FaPen />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(blog.id);
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
