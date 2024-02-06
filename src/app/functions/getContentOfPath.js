import { getSession } from "next-auth/react"
import makeGitHubRequest from "@/app/functions/makeGitHubRequest"

export default async function getContentOfPath(
    accessToken,
    repoFullName,
    path
) {
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
    let index = 0
    for (const content of contents) {
        console.log("content", content)
        console.log("index", index)
        index++
        if (content.type === "dir") {
            // It's a directory, so we recursively get its contents
            const subDirectoryContent = await getContentOfPath(
                accessToken,
                repoFullName,
                content.path
            )
            directoryContent.contents.push(subDirectoryContent)
        } else if (content.type === "file") {
            // It's a file, get its content
            const fileContentData = await makeGitHubRequest(
                "GET",
                content.url,
                accessToken
            )
            const fileContent = Buffer.from(
                fileContentData.content,
                "base64"
            ).toString("utf-8")

            directoryContent.contents.push({
                name: content.name,
                content: fileContent,
                type: "file",
            })
        }
    }

    return directoryContent
}
