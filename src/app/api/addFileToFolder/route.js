import addFileInRepo from "@/app/functions/addFileInRepo"

export async function POST(req) {
    const { accessToken, username, repoName, content, path, message } =
        await req.json()
    console.log("session", accessToken)
    console.log("session", path)
    console.log("session", message)
    if (!accessToken) {
        throw new Error("Error:")
    }

    try {
        await addFileInRepo(
            accessToken, // Access token
            `${username}/${repoName}`, // Repository full name
            "main", // Branch
            path, // File path
            content, // File content
            message // Commit message
        )
        return new Response(JSON.stringify("file added"))
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify("failed to add file"))
    }
}
