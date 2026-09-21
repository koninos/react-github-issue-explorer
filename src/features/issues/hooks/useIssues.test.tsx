import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useIssues } from "./useIssues";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useIssues", () => {
  it("fetches the first page of issues", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
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
      ]),
    });

    const { result } = renderHook(() => useIssues(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]).toEqual([
      {
        id: 123,
        number: 42,
        title: "Fix something",
        html_url: "https://github.com/facebook/react/issues/42",
        state: "open",
        author: "octocat",
      },
    ]);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/facebook/react/issues?page=1&per_page=20",
    );
  });

  it("fetches the next page when fetchNextPage is called", async () => {
    globalThis.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          {
            id: 1,
            number: 1,
            title: "First issue",
            html_url: "https://github.com/facebook/react/issues/1",
            state: "open",
            user: {
              login: "octocat",
            },
          },
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          {
            id: 2,
            number: 2,
            title: "Second issue",
            html_url: "https://github.com/facebook/react/issues/2",
            state: "closed",
            user: {
              login: "octocat",
            },
          },
        ]),
      });

    const { result } = renderHook(() => useIssues(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const nextPageResult = await result.current.fetchNextPage();

    expect(nextPageResult.data?.pages).toHaveLength(2);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://api.github.com/repos/facebook/react/issues?page=1&per_page=20",
    );

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.github.com/repos/facebook/react/issues?page=2&per_page=20",
    );

    expect(nextPageResult.data?.pages[1]).toEqual([
      {
        id: 2,
        number: 2,
        title: "Second issue",
        html_url: "https://github.com/facebook/react/issues/2",
        state: "closed",
        author: "octocat",
      },
    ]);
  });
});
