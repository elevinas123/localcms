import { useEffect, useState, useContext} from "react"

export default function RepositoryComponent(props) {
    const [show, setShow] = useState(false)
    const [taskMenuComponents, setTaskMenuComponents] = useState([])
    const [childrenProjects, setChildrenProjects] = useState([])
    useEffect( () => {
        console.log("props path", props.path)
        let f = async () => {
            console.log("cia yra useEffect", props)
            let response = await fetch(`/api/getDirectoryContents?accessToken=${(props.session.accessToken)}&path=${props.path}&repoFullName=${props.session.user.name}/${props.repository}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status}, ${response.json()}`);
          }
          const responseBody = await response.json()
          console.log("response", responseBody)
          const directories = responseBody.filter(i => i.type == "dir")
          console.log("directories", directories)
          console.log("projektas+++", responseBody )
          setChildrenProjects(directories)
      }
        if (props.path) {
            f()
        }
    
      }, [props.path])
    useEffect(() => {
        console.log("cia yra ten kur daro", props)
        if (props.path === undefined && !show) return
        console.log("cia", childrenProjects)
        setTaskMenuComponents(childrenProjects.map(i => <RepositoryComponent repository={props.repository} session={props.session} path={i.path} level={props.level+1}/>))
    }, [show])
    

    const handleClick = () => {
        setClickCount(i=> i+1)
        setShow(i=> !i)

    }
    // ProjectMenuComponent.js
return (
    <div className="bg-zinc-600  border-4 border-black h-full"  >
        <div className='flex  flex-row  ml-4 mr-4 text-gray-800 p-2 h-full '>
            <button className="" onClick={() => setShow(i => !i)} >{props.path}</button>
            <div>{taskMenuComponents}</div>
        </div>
    </div>
)

}
