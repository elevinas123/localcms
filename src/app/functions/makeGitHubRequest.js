export default async function makeGitHubRequest(method, url, accessToken, body = null) {

    const headers = {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    };
  
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("erorr", errorData)
      throw new Error(`GitHub API responded with ${response.status}: ${JSON.stringify(errorData)}`);
    }
  
    return response.json();
  }
  