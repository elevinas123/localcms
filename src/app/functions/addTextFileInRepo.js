import ensureDirectoryExists from "./ensureDirectoryExists";

const { default: makeGitHubRequest } = require("./makeGitHubRequest");

export default async function addTextFileInRepo(accessToken, repoFullName, branch, path, content, message) {
    const directoryPath = path.substring(0, path.lastIndexOf('/'));
    await ensureDirectoryExists(accessToken, repoFullName, branch, directoryPath);
    const base64content = Buffer.from(content).toString('base64');
    
    // Step 1: Get the SHA of the latest commit on the branch
    const branchData = await makeGitHubRequest('GET', `https://api.github.com/repos/${repoFullName}/branches/${branch}`, accessToken);
    const latestCommitSha = branchData.commit.sha;
    
    // Step 2: Get the SHA of the tree that the latest commit points to
    const commitData = await makeGitHubRequest('GET', `https://api.github.com/repos/${repoFullName}/git/commits/${latestCommitSha}`, accessToken);
    const baseTreeSha = commitData.tree.sha;
    
    // Step 3: Create a new blob with the content of the file
    const blobData = await makeGitHubRequest('POST', `https://api.github.com/repos/${repoFullName}/git/blobs`, accessToken, {
      content: base64content,
      encoding: 'base64',
    });
    const blobSha = blobData.sha;
    
    // Step 4: Create a new tree with the new file path and blob SHA
    const treeData = await makeGitHubRequest('POST', `https://api.github.com/repos/${repoFullName}/git/trees`, accessToken, {
      base_tree: baseTreeSha,
      tree: [
        {
          path: path,
          mode: '100644', // file mode; 100644 for file (blob)
          type: 'blob',
          sha: blobSha,
        },
      ],
    });
    const newTreeSha = treeData.sha;
    
    // Step 5: Create a new commit with the new tree and the previous commit as the parent
    const newCommitData = await makeGitHubRequest('POST', `https://api.github.com/repos/${repoFullName}/git/commits`, accessToken, {
      message,
      tree: newTreeSha,
      parents: [latestCommitSha],
    });
    const newCommitSha = newCommitData.sha;
    
    // Step 6: Update the branch to point to the new commit
    await makeGitHubRequest('PATCH', `https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`, accessToken, {
      sha: newCommitSha,
    });
  }
  