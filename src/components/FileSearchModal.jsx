import { useEffect, useState } from "react";
import RepositoryComponent from "./RepositoryComponent";

export default function FileSearchModal(props) {
    const [dirChosen, setDirChosen] = useState({ repo: "", filePath: "/" });
    const [repoContents, setRepoContents] = useState([]);
    const [repoChecking, setRepoChecking] = useState(true);
    const [creatingRepo, setCreatingRepo] = useState(false);
    const [repoName, setRepoName] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(true)
    const [isValid, setIsValid] = useState(true)
    useEffect(() => {
        if (!props.allRepos) return;
        setDirChosen({ repository: props.allRepos[0], filePath: "/" });
    }, [props.allRepos]);
    useEffect(() => {
        console.log("dirChosen", dirChosen);
    }, [dirChosen]);

    useEffect(() => {
        console.log("allRepos", props.allRepos);
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
        );
    }, [props.session, props.allRepos]);

    const checkIsValid = (repos, name) => {
        const regExp = /[a-zA-Z]/g;
        let lowercaseRepos = repos.map((i) => i.toLowerCase());
        if (lowercaseRepos.indexOf(name.toLowerCase())>=0 || !name || !regExp.test(name)) return false;
        else return true;
    };

    const handleChoose = (repoName) => {
        if (repoName) {
            props.handleRepoChosen({ repository: repoName, filePath: "/" });
        } else if (!dirChosen) {
            setNoRepoChosen(true);
            return;
        } else {
            props.handleRepoChosen(dirChosen);
        }
    };
    function closeModal() {
        const modal = document.getElementById("gitModal");
        if (modal) {
            modal.close(); // Close the dialog
        }
    }
    async function createNewRepo() {
        if (!checkIsValid(props.allRepos, repoName)) {
            setIsValid(false)
            return
        }
        props.createNewRepoInGithub(repoName, description, isPublic)
        setDirChosen()
        setRepoChecking(true)
        setCreatingRepo(false)
        const modal = document.getElementById("createRepoModal");
         if (modal) {
            modal.close(); // Close the dialog
        }
    }


    
    if (creatingRepo) {
        return (
            <dialog id="createRepoModal" className="modal">
                <div className="modal-box flex flex-col justify-between rounded-lg bg-zinc-800 p-6 shadow-lg">
                    <div className="text-white">
                        <h3 className="text-lg font-semibold">Create a New Repository</h3>
                        <div className="mt-4">
                            <label htmlFor="repo-name" className="text-sm text-zinc-400">
                                Repository Name:
                            </label>
                            {!isValid && <div className="text-sm text-red-500">This name already exists</div>}
                            <input
                                id="repo-name"
                                type="text"
                                placeholder="Enter repository name"
                                className={`mt-2 w-full rounded-md bg-zinc-700 p-2 text-white ${!isValid && "border border-red-500"}`}
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="repo-description" className="text-sm text-zinc-400">
                                Description:
                            </label>
                            <textarea
                                id="repo-description"
                                placeholder="Enter a brief description"
                                className="mt-2 w-full rounded-md bg-zinc-700 p-2 text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox rounded text-blue-600"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-zinc-400">Make this repository public</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-action mt-4 flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                createNewRepo()
                            }}
                            className={`btn rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700`}
                        >
                            Create Repository
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setDescription("")
                                setRepoName("")
                                setIsValid(true)
                                setCreatingRepo(false)
                            }}
                            className="btn rounded-md bg-zinc-600 px-4 py-2 font-bold text-white hover:bg-zinc-700"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </dialog>
        );
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
                                e.preventDefault();
                                setRepoChecking(false);
                                // Define your method for changing files
                            }}
                            className="btn rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            Change structure
                        </button>
                        <div className="flex">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeModal();
                                }}
                                className="btn mr-2 rounded-md bg-zinc-600 px-4 py-2 font-bold text-white hover:bg-zinc-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        );
    }

    return (
        <dialog id="gitModal" className="modal rounded-lg shadow-xl">
            <div className="flex  flex-col justify-between rounded-lg bg-zinc-800 p-5 h-1/2 overflow-y-scroll">
                <h3 className="text-center text-lg font-bold text-white">Select the Location for Your json.txt File</h3>
                <p className="mb-4 text-center text-sm text-zinc-400">
                    Choose an existing location or create a new one for your file.
                </p>
                <div className="flex flex-col items-center">{repoContents}</div>
                <div className="modal-action mt-4 flex justify-between border-t border-zinc-600 pt-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCreatingRepo(true);
                        }}
                        className="btn bg-blue-600 text-white hover:bg-blue-500"
                    >
                        Create new Repo
                    </button>
                    <div className="justify-end">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setRepoChecking(true);
                            }}
                            className="btn mr-2 bg-zinc-600 text-white hover:bg-zinc-500"
                        >
                            Close
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                // Ensure 'handleChoose' is properly implemented to handle the selection
                                setRepoChecking(true);
                                handleChoose();
                            }}
                            className="btn bg-blue-600 text-white hover:bg-blue-500"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
