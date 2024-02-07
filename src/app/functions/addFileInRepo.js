import ensureDirectoryExists from "./ensureDirectoryExists"
import makeGitHubRequest from "./makeGitHubRequest"

export default async function addOrUpdateImageInRepo(accessToken, repoFullName, branch, path, content, message) {
    let  directoryPath = path.substring(0, path.lastIndexOf("/"))
    await ensureDirectoryExists(accessToken, repoFullName, branch, directoryPath)

    const base64content = Buffer.from(content).toString("base64")

    // Get the SHA of the latest commit on the branch
    const branchData = await makeGitHubRequest(
        "GET",
        `https://api.github.com/repos/${repoFullName}/branches/${branch}`,
        accessToken
    )
    const latestCommitSha = branchData.commit.sha

    // Get the SHA of the tree that the latest commit points to
    const commitData = await makeGitHubRequest(
        "GET",
        `https://api.github.com/repos/${repoFullName}/git/commits/${latestCommitSha}`,
        accessToken
    )
    const baseTreeSha = commitData.tree.sha

    // Check if the file already exists and get its blob SHA if it does
    let fileSha
    try {
        const fileData = await makeGitHubRequest(
            "GET",
            `https://api.github.com/repos/${repoFullName}/contents/${path}`,
            accessToken
        )
        fileSha = fileData.sha // File SHA is needed if you're updating an existing file
    } catch (error) {
        console.error("Error checking for existing file:")
        console.error("url searched", `https://api.github.com/repos/${repoFullName}/contents/${path}`)
    }

    // Create a new blob with the content of the file
    const blobData = await makeGitHubRequest(
        "POST",
        `https://api.github.com/repos/${repoFullName}/git/blobs`,
        accessToken,
        {
            content: base64content,
            encoding: "base64",
        }
    )
    const blobSha = blobData.sha

    // Create a new tree with the new file path and blob SHA
    const treeData = await makeGitHubRequest(
        "POST",
        `https://api.github.com/repos/${repoFullName}/git/trees`,
        accessToken,
        {
            base_tree: baseTreeSha,
            tree: [
                {
                    path: path,
                    mode: "100644", // file mode; 100644 for file (blob)
                    type: "blob",
                    sha: blobSha,
                },
            ],
        }
    )
    const newTreeSha = treeData.sha

    // Create a new commit with the new tree and the previous commit as the parent
    const newCommitData = await makeGitHubRequest(
        "POST",
        `https://api.github.com/repos/${repoFullName}/git/commits`,
        accessToken,
        {
            message,
            tree: newTreeSha,
            parents: [latestCommitSha],
        }
    )
    const newCommitSha = newCommitData.sha

    // Update the branch to point to the new commit
    await makeGitHubRequest(
        "PATCH",
        `https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`,
        accessToken,
        {
            sha: newCommitSha,
        }
    )
}
