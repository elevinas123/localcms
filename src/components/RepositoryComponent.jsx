import { useEffect, useState, useContext } from "react"
import { PiArrowFatRightBold } from "react-icons/pi"
import { FaAngleDown } from "react-icons/fa"
export default function RepositoryComponent(props) {
    const [show, setShow] = useState(false)
    const [taskMenuComponents, setTaskMenuComponents] = useState([])
    const [savedMenuComponents, setSavedMenuComponents] = useState([])
    const [repoTemplates, setRepoTemplates] = useState([])
    const [directories, setDirectories] = useState([])
    const [changed, setChanged] = useState(false)
    useEffect(() => {
        console.log("props path", props.filePath, props.show)

        if (props.filePath && show) {
            fetchData(props.filePath)
        }
    }, [props.filePath, changed])

    let fetchData = async (filePath) => {
        if (savedMenuComponents.length > 0) {
            setTaskMenuComponents(savedMenuComponents)
            return
        }
        console.log("cia yra useEffect", props)
        let response = await fetch(
            `/api/getDirectoryContents?accessToken=${props.session.accessToken}&path=${filePath}&repoFullName=${props.session.user.name}/${props.repo}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        if (!response.ok) {
            throw new Error(`Error: ${response.status}, ${response.json()}`)
        }
        const responseBody = await response.json()
        console.log("response", responseBody)
        const dirs = responseBody.filter((i) => i.type == "dir")
        console.log("taskMenuComponents", taskMenuComponents)
        setDirectories(dirs)
        setTaskMenuComponents((arr) => {
            return [
                ...dirs.map((i, index) => (
                    <RepositoryComponent
                        setDirChosen={props.setDirChosen}
                        key={index}
                        repo={props.repo}
                        session={props.session}
                        show={false}
                        name={i.name}
                        filePath={i.path}
                    />
                )),
            ]
        })

        setSavedMenuComponents((i) => {
            return [
                ...dirs.map((i, index) => (
                    <RepositoryComponent
                        setDirChosen={props.setDirChosen}
                        key={index}
                        repo={props.repo}
                        session={props.session}
                        show={false}
                        name={i.name}
                        filePath={i.path}
                    />
                )),
            ]
        })
    }

    useEffect(() => {
        console.log("taskMenucomp", taskMenuComponents)
    }, [taskMenuComponents])
    const handleClick = () => {
        props.setDirChosen({
            repository: props.repo,
            filePath: props.filePath,
        })
        setShow((i) => !i)
    }
    useEffect(() => {
        console.log(directories, props, show)
        setTaskMenuComponents((arr) => [])
        setChanged((i) => !i)
    }, [show])

    return (
        <div className="">
            <div className="flex h-auto   flex-col rounded-md border-t border-t-zinc-400  ">
                <button
                    className="group flex h-10 w-full flex-row items-center justify-start rounded-md border-b border-l border-r border-b-zinc-400  border-l-zinc-400 border-r-zinc-400  bg-zinc-800 hover:bg-zinc-700 "
                    onClick={handleClick}
                >
                    <div className="ml-2 flex h-full flex-col justify-center">
                        <FaAngleDown />
                    </div>
                    <div className="ml-2 flex h-4 w-4 flex-col items-center justify-center rounded-full border border-white bg-black">
                        <div className="flex h-2 w-2 flex-row items-center justify-center rounded-full bg-white text-center opacity-0 transition-opacity duration-200 group-focus:opacity-100"></div>
                    </div>
                    <span className="ml-2 flex h-full flex-col justify-center">{props.name}</span>
                </button>
                {show ? <div className="w-auto pl-4">{taskMenuComponents}</div> : ""}
            </div>
        </div>
    )
}
