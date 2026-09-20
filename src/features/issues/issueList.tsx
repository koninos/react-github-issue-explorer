import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchIssues } from "./api";
import { useEffect, useRef } from "react";
import "./issueList.css";

export function IssueList() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam }) => fetchIssues(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastlyFetchedPage, allPagesFetchedSoFar) => {
      const numberOfLastPageIssues = lastlyFetchedPage.length;

      if (numberOfLastPageIssues === 0) {
        return undefined;
      }

      return allPagesFetchedSoFar.length + 1;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver((intersectionEntries) => {
      const [entry] = intersectionEntries;

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const sentinel = sentinelRef.current;

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const issues = data?.pages.flat() ?? [];

  return (
    <main className="issue-explorer">
      <header className="page-header">
        <h1>Issue Explorer</h1>
        <p>Browse issues from the React repository</p>
      </header>

      <ul className="issue-list">
        {issues.map(({ id, html_url, title, number, state, author }) => (
          <li key={id}>
            <article className="issue-card">
              <div className="issue-card__header">
                <h2>
                  <a href={html_url}>{title}</a>
                </h2>
              </div>

              <div className="issue-card__meta">
                <span>#{number}</span>

                <span className={`issue-status issue-status--${state}`}>
                  <span
                    className="issue-status__indicator"
                    aria-hidden="true"
                  />
                  {state}
                </span>

                <span>{author}</span>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="scroll-sentinel" />

      {isFetchingNextPage && (
        <p className="loading-indicator" role="status">
          Loading more issues...
        </p>
      )}
    </main>
  );
}
