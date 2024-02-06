import { useEffect, useState, useContext} from "react"
import { PiArrowFatRightBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa";
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
                return [...dirs.map((i, index) => (
                    <RepositoryComponent key={index} repo={props.repo} session={props.session} show={false} name={i.name} path={i.path} />
                ))]
            
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
        setTaskMenuComponents(arr => [...directories.map((i, index) => <RepositoryComponent key={index} repo={props.repo} session={props.session} show={show} name={i.name} path={i.path} />)])
        setChanged(i=>!i)
    }, [show])
    return (
        <div className="">
            <div className='flex flex-col   border-t rounded-md border-t-zinc-400 h-auto  '>
                <button
                    className=" bg-zinc-800 rounded-md hover:bg-zinc-700 border-l h-10 flex flex-row justify-start w-full border-l-zinc-400  border-b border-b-zinc-400  border-r border-r-zinc-400 "
                    onClick={handleClick}
                >
                    <div  className="flex flex-col justify-center h-full ml-2"><FaAngleDown /></div>
                    <span className="flex flex-col justify-center h-full ml-2">{props.name}</span>
                </button>
                <div className="w-auto pl-4">{taskMenuComponents}</div>
            </div>
        </div>
);

}
