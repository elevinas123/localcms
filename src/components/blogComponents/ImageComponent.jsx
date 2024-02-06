import { useState, useEffect } from "react"
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa"

export default function ImageComponent(props) {
    const [prevIndex, setPrevIndex] = useState(props.index)
    const [content, setContent] = useState(props.content) // replace null with your base64 content if you have any

    // Function to handle file upload and convert to base64
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = async () => {
                // Extract base64 content from the result
                const base64Content = reader.result.split(",")[1] // This removes the prefix and gives you just the base64 string
                const response = await fetch(`/api/postImage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: base64Content, // Send just the base64 string
                    }),
                })
                const image = await response.json()
                setContent(image.image.image.url)
                props.updateComponent(props.id, {
                    ...props,
                    content: image.image.image.url,
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {}, [props])

    return (
        <div className="mt-4 flex w-96 flex-col">
            <div className="text-sm">Image</div>
            <div className="flex w-full flex-row justify-center rounded-sm border bg-zinc-800">
                {content ? (
                    <div className="relative mt-4 h-auto w-64 pb-2">
                        <img src={content} alt="Uploaded" />
                        <div className="absolute left-16 top-20 flex flex-row">
                            <button className="ml-2 flex h-8 w-8 flex-row items-center justify-center rounded-sm bg-zinc-700 text-sm shadow-lg active:bg-zinc-500">
                                <FaTrash />
                            </button>
                            <label className="ml-2 flex h-8 w-8 cursor-pointer flex-row items-center justify-center rounded-sm bg-zinc-700 text-sm shadow-lg active:bg-zinc-500">
                                <FaPencilAlt />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>
                ) : (
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-sm bg-zinc-800 text-sm shadow-lg active:bg-zinc-500">
                        <FaPlus className="text-2xl" />
                        <span>Add Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </label>
                )}
            </div>
        </div>
    )
}
