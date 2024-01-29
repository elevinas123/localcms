import { useState, useEffect } from "react";
import Navbar from "./Navbar"

import Blog from "./Blog";
import TableView from "./TableView";


export default function MainPage (props) {
    
    
    const selectedBlog = props.blogContent.blogs.find(blog => blog.id === props.blogActive);

    useEffect(() => {
        console.log("props", props)
    }, [props])


    return (
        <div>
            <div className="relative flex flex-row bg-zinc-800">
                <Navbar {...props}/>
                {props.blogActive?<Blog blog={selectedBlog} updateBlogInGithub={props.updateBlogInGithub}/>:<TableView sellectBlog={props.sellectBlog} createBlog={props.createBlog} blogContent={props.blogContent} />}
            </div>
        </div>
    )
}