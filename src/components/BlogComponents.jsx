import { FaArrowDown, FaArrowUp, FaEdit, FaTrash } from "react-icons/fa"
import ImageComponent from "./blogComponents/ImageComponent"
import TextComponent from "./blogComponents/TextComponent"
import TitleComponent from "./blogComponents/TitleComponent"
import { FaGear } from "react-icons/fa6"
import { useEffect } from "react"

export default function BlogComponent(props) {
    let component =
        props.type == "image" ? (
            <ImageComponent {...props} />
        ) : props.type == "title" ? (
            <TitleComponent {...props} />
        ) : (
            <TextComponent {...props} />
        )

    return (
        <div className=" group relative mt-4 flex w-full flex-row justify-center border-b border-zinc-400 pb-4  ">
            <div className=" flex  w-2/3 flex-row justify-center ">
                <div className="flex w-full flex-row justify-center rounded border border-zinc-600 pb-2 shadow-lg shadow-zinc-800">
                    {component}
                </div>
            </div>
            <div className="absolute right-3 top-3 flex flex-row">
                {/*<div className=" mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-50 ease-in cursor-pointer hover:bg-zinc-700 border bg-zinc-800 p-2 rounded-md"><FaGear /></div>*/}
                <div
                    className=" duration-50 mr-2 cursor-pointer rounded-md border bg-zinc-800 p-2 opacity-0 transition-opacity ease-in hover:bg-zinc-700 group-hover:opacity-100"
                    onClick={() => props.moveComponentUp(props.id)}
                >
                    <FaArrowUp />
                </div>
                <div
                    className=" duration-50 mr-2 cursor-pointer rounded-md border bg-zinc-800 p-2 opacity-0 transition-opacity ease-in hover:bg-zinc-700 group-hover:opacity-100"
                    onClick={() => props.moveComponentDown(props.id)}
                >
                    <FaArrowDown />
                </div>
                <div
                    onClick={() => props.removeComponent(props.id)}
                    className=" duration-50 mr-2 cursor-pointer rounded-md border bg-zinc-800 p-2 opacity-0 transition-opacity ease-in hover:bg-zinc-700 group-hover:opacity-100"
                >
                    <FaTrash />
                </div>
            </div>
        </div>
    )
}
