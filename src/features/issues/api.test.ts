import { fetchIssues, mapGitHubIssue } from "./api";

describe("mapGitHubIssue", () => {
  it("maps a GitHub issue to the UI model", () => {
    const githubIssue = {
      id: 123,
      number: 42,
      title: "Fix something",
      html_url: "https://github.com/facebook/react/issues/42",
      state: "open" as const,
      user: {
        login: "konstantinos",
      },
    };

    expect(mapGitHubIssue(githubIssue)).toEqual({
      id: 123,
      number: 42,
      title: "Fix something",
      html_url: "https://github.com/facebook/react/issues/42",
      state: "open",
      author: "konstantinos",
    });
  });
});

describe("fetchIssues", () => {
  it("fetches issues and maps them to the Issue model", async () => {
    const githubIssues = [
      {
        id: 123,
        number: 42,
        title: "Fix something",
        html_url: "https://github.com/facebook/react/issues/42",
        state: "open",
        user: {
          login: "octocat",
        },
      },
    ];

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(githubIssues),
    });

    const result = await fetchIssues(2);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/facebook/react/issues?page=2&per_page=20",
    );

    expect(result).toEqual([
      {
        id: 123,
        number: 42,
        title: "Fix something",
        html_url: "https://github.com/facebook/react/issues/42",
        state: "open",
        author: "octocat",
      },
    ]);
  });

  it("throws when the request fails", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchIssues(1)).rejects.toThrow("Failed to fetch issues: 500");
  });
});
