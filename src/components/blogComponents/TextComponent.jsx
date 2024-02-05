
import { useState } from 'react';


export default function TextComponent(props) {

    const [content, setContent] = useState(props.content)

    return (
        <div className="w-96 flex flex-col mt-4">
            <div className="text-sm">Text</div>
            <textarea onBlur={() => props.updateComponent(props.id, {...props, content: content})} className="appearance-none rounded-sm p-2 w-auto bg-zinc-800 border" placeholder='Write here' value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
    )
}