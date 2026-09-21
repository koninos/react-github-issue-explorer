import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchIssues } from "../../api";
import "./issueList.css";
import { IssueRow } from "../issueRow/issueRow";

export function IssueList() {
  const parentRef = useRef<HTMLDivElement | null>(null);

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

      <div
        className="issue-list"
        ref={parentRef}
        aria-label="React repository issues"
      >
        <ul
          className="issue-list__content"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const issue = issues[virtualRow.index];

            return (
              <IssueRow
                key={issue.id}
                issue={issue}
                virtualRow={virtualRow}
                measureElement={rowVirtualizer.measureElement}
              />
            );
          })}
        </ul>
      </div>

      {isFetchingNextPage && (
        <p className="loading-indicator" role="status">
          Loading more issues...
        </p>
      )}
    </main>
  );
}
