// Assuming updateFileInRepo is already defined and imports makeGitHubRequest

import addTextFileInRepo from "./addTextFileInRepo";
import ensureDirectoryExists from "./ensureDirectoryExists";

export default async function addImageInRepo(accessToken, repoFullName, branch, imagePath, imageContentBase64, commitMessage) {
    // Ensure the directory exists
    const directoryPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
    console.log("directory Path", directoryPath)
    await ensureDirectoryExists(accessToken, repoFullName, branch, directoryPath);
    
    // Continue with creating or updating the file
    await addTextFileInRepo(
      accessToken,
      repoFullName,
      branch,
      imagePath,
      imageContentBase64,
      commitMessage
    );
  }
 