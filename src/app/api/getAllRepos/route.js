import makeGitHubRequest from "@/app/functions/makeGitHubRequest";




export async function GET(req) {
    let allRepoNames = [];
    let page = 1;
    let shouldFetch = true;
    const accessToken = req.nextUrl.searchParams.get("accessToken"); // e.g., 'username/repo-name'
    const sessionName = req.nextUrl.searchParams.get("sessionName"); // e.g., 'username/repo-name'
    const url = `https://api.github.com/users/${sessionName}/repos`
    console.log("url", url)
    while (shouldFetch) {
      const paginatedUrl = `${url}?page=${page}&per_page=100`; // Fetch 100 items per page, adjust if needed
  
      try {
        const repos = await makeGitHubRequest('GET', paginatedUrl, accessToken);
        const repoNames = repos.map(repo => repo.name); // Extract only the names
        allRepoNames = [...allRepoNames, ...repoNames];
  
        // Determine if there are more pages to fetch
        // Note: You might need to adjust this based on the structure of your response
        if (repos.length < 100) {
          shouldFetch = false;
        } else {
          page++;
        }
      } catch (error) {
        console.error("An error occurred while fetching repositories: ", error);
        shouldFetch = false;
      }
    }
  
    return new Response(JSON.stringify(allRepoNames))
  }
  