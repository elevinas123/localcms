import { useState } from "react"

export default function TextComponent(props) {
    const [content, setContent] = useState(props.content)

    return (
        <div className="mt-4 flex w-96 flex-col">
            <div className="text-sm">Text</div>
            <textarea
                onBlur={() =>
                    props.updateComponent(props.id, {
                        ...props,
                        content: content,
                    })
                }
                className="w-auto appearance-none rounded-sm border bg-zinc-800 p-2"
                placeholder="Write here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    )
}
