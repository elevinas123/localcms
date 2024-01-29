import { useState, useEffect } from "react";
import Navbar from "./Navbar"

import Blog from "./Blog";
import TableView from "./TableView";


export default function MainPage (props) {
    
    
    const selectedBlog = props.blogContent.blogs.find(blog => blog.id === props.blogActive);

    useEffect(() => {
        if (props.blogActive.content.name) setTitle(props.blogActive.content.name)
        if (props.blogActive.content.text) setText(props.blogActive.content.text)
        if (props.blogActive.content.images) setImages(props.blogActive.content.images)
        
    }, [props])


    return (
        <div>
            <div className="flex flex-row bg-zinc-800">
                <Navbar {...props}/>
                {props.blogActive?<Blog blog={selectedBlog} updateBlogInGithub={props.updateBlogInGithub}/>:<TableView sellectBlog={props.sellectBlog} createBlog={props.createBlog} blogContent={props.blogContent} />}
            </div>
        </div>
    )
}