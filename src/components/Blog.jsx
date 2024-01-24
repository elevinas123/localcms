import { useEffect, useState } from "react"



export default function Blog (props) {
 
    const [content, setContent] = useState([])

    useEffect(() => {
        console.log("blog props", props)
        let p = []
        for(let i=0; i<props.contents.length; i++) {
            if (props.contents[i].name === "images") {
                for(let j=0; j<props.contents[i].contents.length; j++) {
                    if (props.contents[i].contents[j].name === ".gitkeep") continue
                    let imageCode = props.contents[i].contents[j].content
                    console.log("CODE", imageCode)
                    let newImg = imageCode
                    console.log(newImg[0]);
                    console.log(newImg[1]);
                    console.log(newImg[2]);
                    console.log(newImg[newImg.length-1]);
                    console.log(newImg[newImg.length-2]);
                    console.log(newImg[newImg.length-3]);
                    let imageSrc = `data:image/png;base64,${newImg}`; // Create the src for the img element
                    p.push(
                        <div key={j+"image"} className="mt-4">
                            <img src={imageSrc} alt={`Image ${j}`} />
                        </div>
                    );
                }
            }
        }
        console.log(p)
        setContent(p)
    }, [props])

    return(
        <div className="w-96 h-96">
            {content}
        </div>
    )
}