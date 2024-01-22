// Assuming updateFileInRepo is already defined and imports makeGitHubRequest

export default async function addImageInRepo(accessToken, repoFullName, branch, imagePath, imageContentBase64, commitMessage) {
    // Ensure the directory exists
    const directoryPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
    await ensureDirectoryExists(accessToken, repoFullName, branch, directoryPath);
    
    // Continue with creating or updating the file
    await updateFileInRepo(
      accessToken,
      repoFullName,
      branch,
      imagePath,
      imageContentBase64,
      commitMessage
    );
  }
 