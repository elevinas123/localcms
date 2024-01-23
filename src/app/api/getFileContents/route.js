import makeGitHubRequest from "@/app/functions/makeGitHubRequest";
import { getSession } from "next-auth/react";

export  async function GET(req) {
    console.log(req.nextUrl.searchParams)
    const accessToken = await req.nextUrl.searchParams.get("accessToken")
    const repoFullName =await req.nextUrl.searchParams.get("repoFullName")
    const filePath =await req.nextUrl.searchParams.get("filePath")
    
    const session = await getSession({ req });
    console.log(session)
    console.log(accessToken)
    console.log(repoFullName)
    console.log(filePath)

    
    try {
        // Check if the file exists and get its content
        const fileContentData = await makeGitHubRequest('GET', `https://api.github.com/repos/${repoFullName}/contents/${filePath}`, accessToken);
    
        // The content will be base64 encoded, so decode it
        const content = Buffer.from(fileContentData.content, 'base64').toString('utf-8');
        
        return new Response(JSON.stringify({ content }), { status: 200 });
      } catch (error) {
        // If the file does not exist, GitHub API will return a 404 error
        if (error.response && error.response.status === 404) {
          return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
        } else {
          console.error(error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        }
      }
}
