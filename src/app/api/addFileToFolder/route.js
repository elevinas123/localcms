import addTextFileInRepo from "@/app/functions/addTextFileInRepo";




export async function PUT(req) {
  

    const { accessToken, username, repoName, content, path, message } = await req.json()
    console.log("session", accessToken)
    if (!accessToken) {
      throw new Error("Error:")
    }

    try {
      await addTextFileInRepo(
        accessToken,        // Access token
        `${username}/${repoName}`,       // Repository full name
        'main',                     // Branch
        path, // File path
        content,             // File content
        message           // Commit message
      );
      return new Response(JSON.stringify("file added"))
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify("failed to add file"))
    }
  }
  