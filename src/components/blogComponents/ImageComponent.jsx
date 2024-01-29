import { useState, useEffect } from "react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";




export default function ImageComponent (props) {


    const [prevIndex, setPrevIndex] = useState(props.index)
    const [content, setContent] = useState(props.content); // replace null with your base64 content if you have any

    // Function to handle file upload and convert to base64
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                // Extract base64 content from the result
                const base64Content = reader.result.split(',')[1]; // This removes the prefix and gives you just the base64 string
                const response = await fetch(`/api/postImage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        content: base64Content // Send just the base64 string
                    }),
                });
                const image = await response.json()
                setContent(image.image.image.url)
                props.updateComponent(props.id, {...props, content: image.image.image.url})
                
            };
            reader.readAsDataURL(file);
        }
    };
    

    useEffect(() => {
        console.log("ji")
    }, [props])

    return (
        <div className="w-96 flex flex-col mt-8">
            <div className="text-sm">Image</div>
            <div className="flex flex-row w-full bg-zinc-800 rounded-sm justify-center border">
                {content ? (
                    <div className="relative h-auto w-64 mt-4 pb-2">
                        <img src={content} alt="Uploaded" />
                        <div className="absolute flex flex-row top-20 left-16">
                            <button className="flex flex-row justify-center items-center w-8 h-8 bg-zinc-700 ml-2 rounded-sm text-sm shadow-lg active:bg-zinc-500"><FaTrash /></button>
                            <label className="flex flex-row justify-center items-center w-8 h-8 bg-zinc-700 ml-2 rounded-sm text-sm shadow-lg active:bg-zinc-500 cursor-pointer">
                                <FaPencilAlt />
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col justify-center items-center w-full h-32 bg-zinc-800 rounded-sm text-sm shadow-lg active:bg-zinc-500 cursor-pointer">
                        <FaPlus className="text-2xl" />
                        <span>Add Image</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                )}
            </div>
        </div>
    );
}