import { useEffect, useState } from "react"
import RepositoryComponent from "./RepositoryComponent"

export default function FileSearchModal(props) {
    const [dirChosen, setDirChosen] = useState({ repo: "", filePath: "/" })
    const [repoContents, setRepoContents] = useState([])
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

    return (
        <dialog id="gitModal" className="modal">
            <div className="modal-box flex h-96 flex-col justify-between bg-zinc-700">
                <div>
                    <h3 className="flex flex-row justify-center text-lg font-bold">
                        Choose where your json.txt file is located or where to crete it
                    </h3>
                    <div className="flex flex-row justify-center">
                        <div className="flex w-full flex-col justify-center">{repoContents}</div>
                    </div>
                </div>

                <div className="modal-action w-full border-t ">
                    <form method="dialog flex flex-row justify-between bg-red-500 w-full mt-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                closeModal()
                            }}
                            className="btn ml-4 mt-2 bg-zinc-600 text-white hover:bg-zinc-700"
                        >
                            Close
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleChoose()
                                closeModal()
                            }}
                            className="btn ml-4 mt-2 bg-zinc-600 text-white hover:bg-zinc-700"
                        >
                            Done
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}
