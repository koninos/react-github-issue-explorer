import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchIssues } from "./api";
import "./issueList.css";

export function IssueList() {
  const parentRef = useRef<HTMLUListElement | null>(null);

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

  const issues = data?.pages.flat() ?? [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: issues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    measureElement: (element) => element.getBoundingClientRect().height,
    onChange: (instance) => {
      const virtualItems = instance.getVirtualItems();
      const lastItem = virtualItems[virtualItems.length - 1];

      if (!lastItem) {
        return;
      }

      if (
        lastItem.index >= issues.length - 5 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main className="issue-explorer">
      <header className="page-header">
        <h1>Issue Explorer</h1>
        <p>Browse issues from the React repository</p>
      </header>

      <ul className="issue-list" ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const issue = issues[virtualRow.index];
            const { id, html_url, title, number, state, author } = issue;

            return (
              <li
                key={id}
                ref={rowVirtualizer.measureElement}
                className="issue-row"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
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
            );
          })}
        </div>
      </ul>

      {isFetchingNextPage && (
        <p className="loading-indicator" role="status">
          Loading more issues...
        </p>
      )}
    </main>
  );
}
