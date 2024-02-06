import { useEffect, useState, useContext} from "react"
import { PiArrowFatRightBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa";
export default function RepositoryComponent(props) {
    const [show, setShow] = useState(false)
    const [taskMenuComponents, setTaskMenuComponents] = useState([])
    const [savedMenuComponents, setSavedMenuComponents] = useState([])
    const [repoTemplates, setRepoTemplates] = useState([])
    const [directories, setDirectories] = useState([])
    const [changed, setChanged] = useState(false)
    useEffect( () => {
        console.log("props path", props.filePath, props.show)
        
        if (props.filePath && show) {
            fetchData(props.filePath)
        }
      }, [props.filePath, changed])
    
    

    let fetchData = async (filePath) => {
        if (savedMenuComponents.length>0) {
            setTaskMenuComponents(savedMenuComponents)
            return
        }
        console.log("cia yra useEffect", props)
        let response = await fetch(`/api/getDirectoryContents?accessToken=${(props.session.accessToken)}&path=${filePath}&repoFullName=${props.session.user.name}/${props.repo}`, {
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
                    <RepositoryComponent setDirChosen={props.setDirChosen}  key={index} repo={props.repo} session={props.session} show={false} name={i.name} filePath={i.path} />
                ))]
            });
            
        setSavedMenuComponents(i => {
            return [...dirs.map((i, index) => (
                <RepositoryComponent  setDirChosen={props.setDirChosen} key={index} repo={props.repo} session={props.session} show={false} name={i.name} filePath={i.path} />
            ))]
        })
        
    }
    
  useEffect(() => {
    console.log("taskMenucomp", taskMenuComponents)
  }, [taskMenuComponents])
    const handleClick = () => {

        props.setDirChosen({repository: props.repo, filePath: props.filePath})
        setShow(i => !i)
    }
    useEffect(() => {
        console.log(directories, props, show)
        setTaskMenuComponents(arr => [])
        setChanged(i=>!i)
    }, [show])
    
    return (
        <div className="">
            <div className='flex flex-col   border-t rounded-md border-t-zinc-400 h-auto  '>
                <button
                    className="group bg-zinc-800 items-center rounded-md hover:bg-zinc-700 border-l h-10 flex flex-row justify-start w-full border-l-zinc-400  border-b border-b-zinc-400  border-r border-r-zinc-400 "
                    onClick={handleClick}
                >
                    <div  className="flex flex-col justify-center h-full ml-2"><FaAngleDown /></div>
                    <div  className="flex flex-col justify-center items-center ml-2 w-4 h-4 bg-black rounded-full border-white border"><div className="w-2 h-2 bg-white flex-row flex rounded-full justify-center items-center text-center opacity-0 group-focus:opacity-100 transition-opacity duration-200"></div></div>
                    <span className="flex flex-col justify-center h-full ml-2">{props.name}</span>
                </button>
                {show?<div className="w-auto pl-4">{taskMenuComponents}</div>:""}
            </div>
        </div>
);

}
