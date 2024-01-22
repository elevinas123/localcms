const { default: makeGitHubRequest } = require("./makeGitHubRequest");


export default async function ensureDirectoryExists(accessToken, repoFullName, branch, directoryPath) {
    // Check if the directory already has a .gitkeep file
    const gitkeepPath = `${directoryPath.replace(/\/$/, '')}/.gitkeep`; // Ensures no trailing slash and adds '/.gitkeep'
    try {
      await makeGitHubRequest('GET', `https://api.github.com/repos/${repoFullName}/contents/${gitkeepPath}?ref=${branch}`, accessToken);
      console.log(`${gitkeepPath} already exists`);
    } catch (error) {
      if (error.message.includes('Not Found')) {
        // The .gitkeep file does not exist, create it
        console.log(`Creating ${gitkeepPath}`);
        await makeGitHubRequest('PUT', `https://api.github.com/repos/${repoFullName}/contents/${gitkeepPath}`, accessToken, {
          message: 'Create .gitkeep',
          content: Buffer.from('').toString('base64'), // Empty content for .gitkeep
          branch: branch,
        });
      } else {
        // Rethrow the error if it's not because the file wasn't found
        throw error;
      }
    }
  }
  