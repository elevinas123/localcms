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
    useEffect(() => {
        setComponents(props.blog.components)
    }, [props.blog.components])

    const addComponent = (e) => {
        console.log(e.target.id)
        setComponents((i) => [...i, { type: e.target.id, content: "", id: uuidv4(), index: i.length }])
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

    return (
        <div className="flex w-screen flex-col overflow-y-auto bg-zinc-800 pl-12 pr-12 pt-8 text-white">
            <div className="flex flex-row justify-center">
                <div className="flex w-2/3 flex-row justify-between">
                    <div className="flex flex-col justify-center text-3xl">{props.blog.title}</div>
                    <div className="flex flex-row ">
                        <button className="mr-2 flex flex-row items-center justify-center rounded-sm border bg-zinc-600 p-2">
                            Delete
                        </button>
                        <button
                            className="flex flex-row items-center justify-center rounded-sm border bg-zinc-600 p-2"
                            onClick={updateBlog}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-row justify-center">
                <div className="mt-10 flex w-2/3 flex-row justify-center rounded-md bg-zinc-700 p-6">
                    <div className="flex w-full flex-col">
                        {componentTemplates}
                        <div
                            className={`dropdown dropdown-top flex flex-row justify-center pl-2 pr-2 ${
                                components.length > 0
                                    ? "rounded-b-full border-b border-l border-r"
                                    : "rounded-full border"
                            } cursor-pointer hover:bg-zinc-600`}
                        >
                            <div
                                tabIndex={0}
                                role="button"
                                className="  flex h-full w-full flex-row justify-center pb-2 pt-2"
                            >
                                <FaPlus />
                            </div>
                            <ul
                                tabIndex={1}
                                className="menu dropdown-content z-10 mt-2  w-52 rounded-md  bg-zinc-600 p-2 shadow-lg"
                            >
                                <li className="rounded-md text-white hover:bg-zinc-800">
                                    <a onClick={addComponent} id="title">
                                        Title
                                    </a>
                                </li>
                                <li className="rounded-md text-white hover:bg-zinc-800">
                                    <a onClick={addComponent} id="text">
                                        Text
                                    </a>
                                </li>
                                <li className="rounded-md text-white hover:bg-zinc-800">
                                    <a onClick={addComponent} id="image">
                                        Image
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
    )
}
