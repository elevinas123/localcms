import { useEffect, useState, useContext} from "react"

export default function RepositoryComponent(props) {
    const [show, setShow] = useState(false)
    const [taskMenuComponents, setTaskMenuComponents] = useState([])
    useEffect( () => {
        console.log("props path", props.path)
        
        if (props.path) {
            fetchData(0, props.path)
        }
      }, [props.path])
    useEffect(() => {
        console.log("cia yra ten kur daro", props)
        if (props.path === undefined && !show) return
    }, [show])
    
let fetchData = async (level, path) => {
    console.log("cia yra useEffect", props)
    let response = await fetch(`/api/getDirectoryContents?accessToken=${(props.session.accessToken)}&path=${path}&repoFullName=${props.session.user.name}/${props.repository}`, {
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
    console.log("taskMenuComponents", taskMenuComponents)
    setTaskMenuComponents(arr => {
        let newArr = [...arr.slice(0, level)];
        newArr.push(directories.map((i, index) => <button key={index} className="text-white border-b-2 h-full p-2" onClick={() => fetchData(level + 1, i.path)}>{i.path}</button>));
        return newArr;
    });
    
  }
  useEffect(() => {
    console.log("taskMenucomp", taskMenuComponents)
  }, [taskMenuComponents])
return (
    <div className="bg-zinc-600 ml-2  border-l-2 border-t-2  border-r-black h-full"  >
        <div className='flex  flex-row   text-gray-800   h-full '>
            {taskMenuComponents.map((i, index) => <div key={index} className="border-r-2  flex flex-col h-full">{i}</div>)}
        </div>
    </div>
)

}
