import { useEffect, useState } from "react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import BlogComponent from "./BlogComponents";
import { v4 as uuidv4 } from 'uuid';

export default function Blog (props) {
 
    const [published, setPublished] = useState(false)
    const [components, setComponents] = useState([])
    const [componentTemplates, setComponentTemplates] = useState([])
    useEffect(() => {
        setComponents(props.blog.components)
    }, [props.blog.components])
    
    const addComponent = (e) => {
        console.log(e.target.id)
        setComponents(i => [...i, {type: e.target.id, content: "", id: uuidv4(), index: i.length}])
    }
    const removeComponent = (id) => {
        console.log("id", id)
        console.log("components", components)
        setComponents(comp => comp.filter(i => i.id !== id))
    }
    const updateBlog = () => {
        const blog = {
            title: props.blog.title,
            components: components,
            id: props.blog.id,
            published: published
        }
        props.updateBlogInGithub(props.blog.id, blog)
    }
    const updateComponent = (id, component) => {
        console.log(id, component)
        setComponents(comp => comp.map(i=> {
            if (i.id!==id) return i
            return component
        }))
    }
    const moveComponentUp = (componentId) => {
        setComponents(currentComponents => {
            const index = currentComponents.findIndex(c => c.id === componentId);
            if (index > 0) {
                const newComponents = [...currentComponents];
                [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
                return newComponents;
            }
            return currentComponents;
        });
    };
    
    const moveComponentDown = (componentId) => {
        setComponents(currentComponents => {
            const index = currentComponents.findIndex(c => c.id === componentId);
            if (index < currentComponents.length - 1) {
                const newComponents = [...currentComponents];
                [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
                return newComponents;
            }
            return currentComponents;
        });
    };
    
    useEffect(() => {
        console.log("ji")
        setComponentTemplates(components.map((i, index) => <BlogComponent moveComponentDown={moveComponentDown} moveComponentUp={moveComponentUp} updateComponent={updateComponent} removeComponent={removeComponent} key={uuidv4()} {...i}/>))

    }, [components])
    
    return(
        <div className="flex flex-col w-screen pt-8 pr-12 pl-12 bg-zinc-800 text-white overflow-y-auto">
                    <div className="flex flex-row justify-center">
                        <div className="w-2/3 flex flex-row justify-between">
                            <div className="text-3xl flex flex-col justify-center">{props.blog.title}</div>
                            <div className="flex flex-row ">
                                <button className="flex flex-row justify-center items-center rounded-sm bg-zinc-600 mr-2 border p-2" >Delete</button>
                                <button className="flex flex-row justify-center items-center rounded-sm bg-zinc-600 border p-2" onClick={updateBlog} >Save</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full justify-center flex flex-row">
                        <div className="bg-zinc-700 mt-10 p-6 flex flex-row rounded-md justify-center w-2/3">
                            <div className="flex flex-col w-full">
                                {componentTemplates}
                                <div className={`dropdown dropdown-top flex flex-row justify-center p-2 ${components.length>0?"border-r border-b border-l rounded-b-full":"rounded-full border"} cursor-pointer hover:bg-zinc-600`}>
                                    <div tabIndex={0} role="button" className="w-full flex flex-row justify-center"><FaPlus /></div>
                                    <ul  tabIndex={1} className="dropdown-content z-10 menu p-2  bg-zinc-600 shadow-lg  rounded-md w-52 mt-2">
                                        <li  className="text-white rounded-md hover:bg-zinc-800"><a onClick={addComponent} id="title">Title</a></li>
                                        <li  className="text-white rounded-md hover:bg-zinc-800"><a onClick={addComponent} id="text">Text</a></li>
                                        <li  className="text-white rounded-md hover:bg-zinc-800"><a onClick={addComponent} id="image">Image</a></li>
                                    </ul>
                                </div>
                                
                                
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div></div>
                </div>
    )
}