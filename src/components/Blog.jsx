import { useEffect, useState } from "react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { FaTrash } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaPencilAlt } from "react-icons/fa"
import BlogComponent from "./BlogComponents"
import { v4 as uuidv4 } from "uuid"

export default function Blog(props) {
    const [published, setPublished] = useState(false)
    const [components, setComponents] = useState([])
    const [componentTemplates, setComponentTemplates] = useState([])
    try {
        useEffect(() => {
        try {
            setComponents(props.blog.components)
        } catch(error) {
            
        }
    }, [props.blog.components])

    } catch (err) {
        console.log(err)
    }
    const addComponent = (id) => {
        setComponents((i) => [...i, { type: id, content: "", id: uuidv4(), index: i.length }]);
    }
    const removeComponent = (id) => {
        setComponents((comp) => comp.filter((i) => i.id !== id))
    }
    const updateBlog = () => {
        const blog = {
            title: props.blog.title,
            components: components,
            id: props.blog.id,
            published: published,
        }
        props.updateBlogInGithub(props.blog.id, blog)
    }
    const updateComponent = (id, component) => {
        setComponents((comp) =>
            comp.map((i) => {
                if (i.id !== id) return i
                return component
            })
        )
    }
    const moveComponentUp = (componentId) => {
        setComponents((currentComponents) => {
            const index = currentComponents.findIndex((c) => c.id === componentId)
            if (index > 0) {
                const newComponents = [...currentComponents]
                ;[newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]]
                return newComponents
            }
            return currentComponents
        })
    }

    const moveComponentDown = (componentId) => {
        setComponents((currentComponents) => {
            const index = currentComponents.findIndex((c) => c.id === componentId)
            if (index < currentComponents.length - 1) {
                const newComponents = [...currentComponents]
                ;[newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]]
                return newComponents
            }
            return currentComponents
        })
    }

    useEffect(() => {
        setComponentTemplates(
            components.map((i, index) => (
                <BlogComponent
                    moveComponentDown={moveComponentDown}
                    moveComponentUp={moveComponentUp}
                    updateComponent={updateComponent}
                    removeComponent={removeComponent}
                    key={uuidv4()}
                    {...i}
                />
            ))
        )
    }, [components])
    const handleDelete = (e) => {
        e.stopPropagation()

        console.log("cia")
        props.deleteBlog(props.blog.id)
    }

    return (
    <div className="flex w-screen flex-col overflow-y-auto bg-zinc-800 p-12 text-white">
        <header className="flex justify-center">
            <div className="w-2/3 flex justify-between items-center">
                <h1 className="text-3xl">{props.blog.title}</h1>
                <div className="flex space-x-2">
                    <button
                        className="flex items-center justify-center rounded-sm border border-transparent bg-zinc-600 px-4 py-2 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                        onClick={handleDelete}
                        aria-label="Delete blog"
                    >
                        Delete
                    </button>
                    <button
                        className="flex items-center justify-center rounded-sm border border-transparent bg-zinc-600 px-4 py-2 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                        onClick={updateBlog}
                        aria-label="Save changes"
                    >
                        Save
                    </button>
                </div>
            </div>
        </header>
        <main className="flex flex-col items-center pt-10">
            <div className="w-2/3 bg-zinc-700 rounded-md p-6">
                <div className="flex flex-col space-y-4">
                    {/* Placeholder for dynamically added components */}
                    {componentTemplates}
                    <div
                        className={`dropdown dropdown-top flex justify-center items-center p-2 rounded-md cursor-pointer hover:bg-zinc-600 ${
                            components.length > 0 ? "border-t border-l border-r" : "border"
                        }`}
                        tabIndex={0}
                    >
                        <FaPlus />
                        <ul
                            className="dropdown-content menu z-10 mt-2 w-52 rounded-md bg-zinc-600 p-2 shadow-lg"
                        >
                            <li>
                                <a onClick={() => addComponent("title")} className="rounded-md text-white hover:bg-zinc-800 p-2">Title</a>
                            </li>
                            <li>
                                <a onClick={() => addComponent("text")} className="rounded-md text-white hover:bg-zinc-800 p-2">Text</a>
                            </li>
                            <li>
                                <a onClick={() => addComponent("image")} className="rounded-md text-white hover:bg-zinc-800 p-2">Image</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

}
