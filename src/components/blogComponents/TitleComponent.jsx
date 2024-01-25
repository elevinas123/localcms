import { useState } from "react"





export default function TitleComponent(props) {

    const [content, setContent] = useState(props.content)

    return(
        <div className="w-96 flex flex-col mt-8">
            <div className="text-sm">Title</div>
            <input onBlur={() => props.updateComponent(props.id, {...props, content: content})} placeholder="Write title" className="appearance-none rounded-sm p-2 w-auto bg-zinc-800 border" value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
    )
}