import { useEffect, useState } from "react"
import RepositoryComponent from "./RepositoryComponent"

export default function FileSearchModal(props) {
    const [dirChosen, setDirChosen] = useState({ repo: "", filePath: "/" })
    const [repoContents, setRepoContents] = useState([])
    const [repoChecking, setRepoChecking] = useState(true)
    useEffect(() => {
        if (!props.allRepos) return
        setDirChosen({ repo: props.allRepos[0], filePath: "/" })
    }, [props.allRepos])
    useEffect(() => {
        console.log("dirChosen", dirChosen)
    }, [dirChosen])

    useEffect(() => {
        setRepoContents(
            props.allRepos.map((i, index) => (
                <RepositoryComponent
                    setDirChosen={setDirChosen}
                    key={index}
                    repo={i}
                    session={props.session}
                    show={true}
                    name={i}
                    filePath={"/"}
                />
            ))
        )
    }, [props.session, props.allRepos])

    const handleChoose = (e) => {
        if (!dirChosen) {
            setNoRepoChosen(true)
            return
        }
        props.handleRepoChosen(dirChosen)
    }
    function closeModal() {
        const modal = document.getElementById("gitModal")
        if (modal) {
            modal.close() // Close the dialog
        }
    }

    if (repoChecking) {
        return (
            <dialog id="gitModal" className="modal">
                <div className="modal-box flex flex-col justify-between rounded-lg bg-zinc-800 p-6 shadow-lg">
                    <div className="text-white">
                        <h3 className="text-lg font-semibold">Repository Information</h3>
                        <div className="mt-4">
                            <div className="text-sm text-zinc-400">Current Repository:</div>
                            <div className="text-white">{props.repository}</div>
                        </div>
                        <div className="mt-4">
                            <div className="text-sm text-zinc-400">File Path:</div>
                            <div className="text-white">{props.filePath}</div>
                        </div>
                    </div>

                    <div className="modal-action mt-4 flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setRepoChecking(false)
                                // Define your method for changing files
                            }}
                            className="btn rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            Change structure
                        </button>
                        <div className="flex">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    closeModal()
                                }}
                                className="btn mr-2 rounded-md bg-zinc-600 px-4 py-2 font-bold text-white hover:bg-zinc-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        )
    }


    return (
        <dialog id="gitModal" className="modal rounded-lg shadow-xl">
            <div className="flex  flex-col justify-between rounded-lg bg-zinc-800 p-5 h-1/2 overflow-y-scroll">
                <h3 className="text-center text-lg font-bold text-white">Select the Location for Your json.txt File</h3>
                <p className="mb-4 text-center text-sm text-zinc-400">
                    Choose an existing location or create a new one for your file.
                </p>
                <div className="flex flex-col items-center">{repoContents}</div>
                <div className="modal-action mt-4 flex justify-end border-t border-zinc-600">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setRepoChecking(true)

                        }}
                        className="btn mr-2 bg-zinc-600 text-white hover:bg-zinc-500"
                    >
                        Close
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            // Ensure 'handleChoose' is properly implemented to handle the selection
                            setRepoChecking(true)
                            handleChoose()

                        }}
                        className="btn bg-blue-600 text-white hover:bg-blue-500"
                    >
                        Done
                    </button>
                </div>
            </div>
        </dialog>
    )


}
