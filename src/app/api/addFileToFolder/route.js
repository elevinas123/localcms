



export async function PUT(req) {
  

    const { accessToken } = await req.json()
    console.log("session", accessToken)
    if (!accessToken) {
      throw new Error("Error:")
    }

    try {
      await updateFileInRepo(
        session.accessToken,        // Access token
        'username/repo-name',       // Repository full name
        'main',                     // Branch
        'src/pages/images/newfile.txt', // File path
        'File content',             // File content
        'Add newfile.txt'           // Commit message
      );
      return new Response(JSON.stringify("file added"))
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify("failed to add file"))
    }
  }
  