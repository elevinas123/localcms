import { useEffect, useState, useContext} from "react"
import { PiArrowFatRightBold } from "react-icons/pi";
export default function RepositoryComponent(props) {
    const [show, setShow] = useState(false)
    const [taskMenuComponents, setTaskMenuComponents] = useState([])
    const [repoTemplates, setRepoTemplates] = useState([])
    const [directories, setDirectories] = useState([])
    const [changed, setChanged] = useState(false)
    useEffect( () => {
        console.log("props path", props.path, props.show)
        
        if (props.path && show) {
            fetchData(props.path)
        }
      }, [props.path, changed])
    
    

    let fetchData = async (path) => {
        console.log("cia yra useEffect", props)
        let response = await fetch(`/api/getDirectoryContents?accessToken=${(props.session.accessToken)}&path=${path}&repoFullName=${props.session.user.name}/${props.repo}`, {
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
        const dirs = responseBody.filter(i => i.type == "dir")
        console.log("taskMenuComponents", taskMenuComponents)
        setDirectories(dirs)
        setTaskMenuComponents(arr => {
                return dirs.map((i, index) => (
                    <RepositoryComponent key={index} repo={props.repo} session={props.session} show={false} name={i.name} path={i.path} />
                ))
            
            return newArr;
        });
        
    }
  useEffect(() => {
    console.log("taskMenucomp", taskMenuComponents)
  }, [taskMenuComponents])
    const handleClick = () => {
        setShow(i => !i)
    }
    useEffect(() => {
        console.log(directories, props, show)
        setTaskMenuComponents(arr => directories.map((i, index) => <RepositoryComponent key={index} repo={props.repo} session={props.session} show={show} name={i.name} path={i.path} />))
        setChanged(i=>!i)
    }, [show])
    return (
        <div className="ml-2">
            <div className='flex flex-col  border-t border-t-zinc-400 w-64 h-auto '>
                <button
                    className=" bg-zinc-800 hover:bg-zinc-700 border-l h-10 w-full border-l-zinc-400  border-b border-b-zinc-400  border-r border-r-zinc-400 "
                    onClick={handleClick}
                >
                    <span className="">{props.name}</span>
                </button>
                <div>{taskMenuComponents}</div>
            </div>
        </div>
);

}
