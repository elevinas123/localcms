import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import ImageComponent from "./blogComponents/ImageComponent";
import TextComponent from "./blogComponents/TextComponent";
import TitleComponent from "./blogComponents/TitleComponent";
import { useEffect } from "react";

export default function BlogComponent(props) {
    let Component = null;

    switch (props.type) {
        case "image":
            Component = ImageComponent;
            break;
        case "title":
            Component = TitleComponent;
            break;
        case "text":
            Component = TextComponent;
            break;
        default:
            throw new Error(`Unsupported component type: ${props.type}`);
    }

    return (
        <div className="relative mt-4 w-full flex justify-center group">
            <div className="flex w-2/3 justify-center">
                <div className="flex w-full justify-center rounded border border-zinc-600 shadow-lg shadow-zinc-800">
                    <Component {...props} />
                </div>
            </div>
            <div className="absolute top-3 right-3 flex space-x-2 z-20">
                <button
                    className="rounded-md border bg-zinc-800 p-2 opacity-0 group-hover:opacity-100 transition-opacity ease-in hover:bg-zinc-700"
                    onClick={() => props.moveComponentUp(props.id)}
                    aria-label="Move component up"
                >
                    <FaArrowUp />
                </button>
                <button
                    className="rounded-md border bg-zinc-800 p-2 opacity-0 group-hover:opacity-100 transition-opacity ease-in hover:bg-zinc-700"
                    onClick={() => props.moveComponentDown(props.id)}
                    aria-label="Move component down"
                >
                    <FaArrowDown />
                </button>
                <button
                    onClick={() => props.removeComponent(props.id)}
                    className="rounded-md border bg-zinc-800 p-2 opacity-0 group-hover:opacity-100 transition-opacity ease-in hover:bg-zinc-700"
                    aria-label="Delete component"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}
