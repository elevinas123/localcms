import makeGitHubRequest from "@/app/functions/makeGitHubRequest"
import { getSession } from "next-auth/react"
import addFileInRepo from "@/app/functions/addFileInRepo"

export async function GET(req) {
    console.log(req.nextUrl.searchParams)
    const accessToken = req.nextUrl.searchParams.get("accessToken")
    const repoFullName = req.nextUrl.searchParams.get("repoFullName")
    const filePath = req.nextUrl.searchParams.get("filePath")
    console.log(accessToken)
    console.log(repoFullName)
    console.log("file tipo sitas?", filePath)

    try {
        // Check if the file exists and get its content
        const fileContentData = await makeGitHubRequest(
            "GET",
            `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
            accessToken
        )

        // The content will be base64 encoded, so decode it
        const content = Buffer.from(fileContentData.content, "base64").toString(
            "utf-8"
        )

        return new Response(JSON.stringify(content), { status: 200 })
    } catch (error) {
        /*
        const json = {
          images: [
            {name: paveiksliukas.png, content: "content", sizeX: 200, sizeY: 200}
          ]
          blogs: [
            {name: blog1, components: [type: text or image or title]}
          ]
        }


        */

        const content = {
            images: [],
            blogs: [],
        }
        // If the file does not exist, GitHub API will return a 404 error
        console.log(error.response)
        try {
            console.log("labas ryutas")
            await addFileInRepo(
                accessToken, // Access token
                repoFullName, // Repository full name
                "main", // Branch
                filePath, // File path
                JSON.stringify(content), // File content
                "Added " + filePath.split("/")[filePath.split("/").length - 1] // Commit message
            )
            return new Response(JSON.stringify(content))
        } catch (error) {
            console.error(error)
            return new Response(
                JSON.stringify({ error: "Adding file failed" }),
                {
                    status: 404,
                }
            )
        }
    }
}
