import { IssueRow } from "../issueRow/issueRow";
import { useIssues } from "../../hooks/useIssues";
import "./issueList.css";
import { useIssueVirtualizer } from "../../hooks/useIssueVirtualization";

export function IssueList() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIssues();

  const issues = data?.pages.flat() ?? [];

  const { parentRef, rowVirtualizer } = useIssueVirtualizer({
    issues,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
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
