export type Issue = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  author: string;
};

type GitHubIssue = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  user: {
    login: string;
  };
};

export function mapGitHubIssue(issue: GitHubIssue): Issue {
  const { id, html_url, number, state, title, user } = issue;

  return {
    id,
    number,
    title,
    html_url,
    state,
    author: user.login,
  };
}

export async function fetchIssues(page: number): Promise<Issue[]> {
  const API_URL = "https://api.github.com/repos/facebook/react/issues";
  const paginationParam = `page=${page}&per_page=20`;

  const response = await fetch(`${API_URL}?${paginationParam}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.status}`);
  }

  const issues: GitHubIssue[] = await response.json();

  return issues.map(mapGitHubIssue);
}
