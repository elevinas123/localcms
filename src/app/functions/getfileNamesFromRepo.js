import { getSession } from "next-auth/react"
import makeGitHubRequest from "@/app/functions/makeGitHubRequest"

export default async function getContentOfPath(
    accessToken,
    repoFullName,
    path
) {
    const accessToken = req.nextUrl.searchParams.get("accessToken") // e.g., 'username/repo-name'
    const repoFullName = req.nextUrl.searchParams.get("repoFullName") // e.g., 'username/repo-name'
    const path = req.nextUrl.searchParams.get("path") // e.g., 'username/repo-name'

    const contents = await makeGitHubRequest(
        "GET",
        `https://api.github.com/repos/${repoFullName}/contents/${path}`,
        accessToken
    )
    console.log("pirmas content", contents)
    const directoryContent = {
        name: path.split("/").pop(), // Get the last part of the path as the name
        contents: [],
        type: "dir",
    }

    return directoryContent
}
