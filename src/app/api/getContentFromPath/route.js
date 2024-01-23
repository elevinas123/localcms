import getContentOfPath from "@/app/functions/getContentOfPath";

export async function GET(req) {

    const accessToken = req.nextUrl.searchParams.get("accessToken"); // e.g., 'username/repo-name'
    const repoFullName = req.nextUrl.searchParams.get("repoFullName"); // e.g., 'username/repo-name'
    const directory = req.nextUrl.searchParams.get("directory"); // e.g., 'src/pages'
    console.log("cia", accessToken, repoFullName, directory)
    try {
        const directoryStructure = await getContentOfPath(accessToken, repoFullName, directory);
        return new Response(JSON.stringify(directoryStructure), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}