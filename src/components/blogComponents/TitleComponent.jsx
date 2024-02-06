import { useState } from "react"

export default function TitleComponent(props) {
    const [content, setContent] = useState(props.content)

    return (
        <div className="mt-4 flex w-96 flex-col">
            <div className="text-sm">Title</div>
            <input
                onBlur={() =>
                    props.updateComponent(props.id, {
                        ...props,
                        content: content,
                    })
                }
                placeholder="Write title"
                className="w-auto appearance-none rounded-sm border bg-zinc-800 p-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    )
}
