import makeGitHubRequest from "@/app/functions/makeGitHubRequest"

export async function GET(req) {
    const accessToken = req.nextUrl.searchParams.get("accessToken") // e.g., 'username/repo-name'
    const repoFullName = req.nextUrl.searchParams.get("repoFullName") // e.g., 'username/repo-name'
    const path = req.nextUrl.searchParams.get("path") // e.g., 'username/repo-name'
    console.log("path", path)
    console.log("accessToken", accessToken)
    console.log("repoFullName", repoFullName)
    const contents = await makeGitHubRequest(
        "GET",
        `https://api.github.com/repos/${repoFullName}/contents/${path}`,
        accessToken
    )
    console.log("pirmas content", contents)

    return new Response(JSON.stringify(contents))
}
