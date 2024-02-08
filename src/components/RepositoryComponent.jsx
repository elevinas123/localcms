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
        <div className="flex w-full flex-col rounded-md border-t border-zinc-400">
            <button
                className="group flex h-10 w-full items-center rounded-md border border-zinc-400 bg-zinc-800 px-4 hover:bg-zinc-700"
                onClick={handleClick}
            >
                <FaAngleDown className="text-white" />
                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-black">
                    <div className="h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-200 group-focus:opacity-100"></div>
                </div>
                <span className="ml-2 text-white">{props.name}</span>
            </button>
            {show && <div className="pl-4">{taskMenuComponents}</div>}
        </div>
    )
}
