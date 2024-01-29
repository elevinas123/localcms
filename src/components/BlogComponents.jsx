import { FaArrowDown, FaArrowUp, FaEdit, FaTrash } from "react-icons/fa"
import ImageComponent from "./blogComponents/ImageComponent"
import TextComponent from "./blogComponents/TextComponent"
import TitleComponent from "./blogComponents/TitleComponent"
import { FaGear } from "react-icons/fa6";
import { useEffect } from "react";



export default function BlogComponent(props) {

    let component = props.type=="image"?<ImageComponent {...props} />:props.type=="title"?<TitleComponent {...props} />:<TextComponent  {...props}/>

    

    
    return (
        <div className=" group relative flex flex-row justify-center w-full border-b border-zinc-400 pb-4 mt-4  ">
            <div className=" w-2/3  flex flex-row justify-center ">
                <div className="shadow-zinc-800 shadow-lg w-full flex flex-row justify-center pb-2 rounded border border-zinc-600" >{component}</div>
            </div>
            <div className="flex flex-row absolute top-3 right-3">
                {/*<div className=" mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-50 ease-in cursor-pointer hover:bg-zinc-700 border bg-zinc-800 p-2 rounded-md"><FaGear /></div>*/}
                <div  className=" mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-50 ease-in cursor-pointer hover:bg-zinc-700 border bg-zinc-800 p-2 rounded-md" onClick={() => props.moveComponentUp(props.id)}  ><FaArrowUp /></div>
                <div  className=" mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-50 ease-in cursor-pointer hover:bg-zinc-700 border bg-zinc-800 p-2 rounded-md" onClick={() => props.moveComponentDown(props.id)} ><FaArrowDown /></div>
                <div onClick={() =>props.removeComponent(props.id)} className=" mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-50 ease-in cursor-pointer hover:bg-zinc-700 border bg-zinc-800 p-2 rounded-md"><FaTrash /></div>
            </div>
        </div>
    )
}