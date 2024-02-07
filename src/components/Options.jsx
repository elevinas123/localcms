import { FaGear } from "react-icons/fa6"
import { FaGithub } from "react-icons/fa"
import { FaFolderTree } from "react-icons/fa6"
import { signOut } from "next-auth/react"
import { FaUserSlash } from "react-icons/fa"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function Options(props) {
    return (
        <div className="mb-8 ml-4 ">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <FaGear className="h-6 w-6 cursor-pointer text-white hover:text-gray-300 " />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mb-2 ml-4 h-64 w-48 bg-zinc-700 text-white shadow-lg">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-md h-10 " onClick={props.handleGithubRepoChoose}>
                        <span className="mr-2">
                            <FaFolderTree />
                        </span>
                        Repository
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-md h-10">
                        <a
                            href={`https://github.com/${props.session.user.name}/${props.repository}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <span className="mr-2">
                                <FaGithub />
                            </span>
                            Github
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-md h-10" onClick={() => signOut()}>
                        <span className="mr-2">
                            <FaUserSlash />
                        </span>
                        Logout
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
