import makeGitHubRequest from "@/app/functions/makeGitHubRequest";

export async function GET(req) {
    let allRepoNames = [];
    let page = 1;
    let shouldFetch = true;
    const accessToken = req.nextUrl.searchParams.get("accessToken");
    const url = `https://api.github.com/user/repos`; // Changed to fetch all repos accessible to the authenticated user

    while (shouldFetch) {
        const paginatedUrl = `${url}?page=${page}&per_page=100`; // Fetch up to 100 items per page

        try {
            const repos = await makeGitHubRequest("GET", paginatedUrl, accessToken);
            console.log("repos", repos);
            const repoNames = repos.map((repo) => repo.name);
            allRepoNames = [...allRepoNames, ...repoNames];

            if (repos.length < 100) {
                shouldFetch = false; // No more pages to fetch
            } else {
                page++; // Increment page number to fetch next set of repos
            }
        } catch (error) {
            console.error("An error occurred while fetching repositories: ", error);
            shouldFetch = false;
        }
    }
    console.log("allRepos", allRepoNames);

    return new Response(JSON.stringify(allRepoNames));
}
