import { IssueRow } from "../issueRow/issueRow";
import { useIssues } from "../../hooks/useIssues";
import { Error } from "../error/error";
import { useIssueVirtualizer } from "../../hooks/useIssueVirtualization";
import { Loader } from "../loader/loader";
import "./issueList.css";

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

  return (
    <main className="issue-explorer">
      <header className="page-header">
        <h1>Issue Explorer</h1>
        <p>Browse issues from the React repository</p>
      </header>

      {isPending && <Loader />}

      {isError && <Error errorMsg={error.message} />}

      {!isPending && !isError && (
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
      )}

      {isFetchingNextPage && (
        <p className="loading-indicator" role="status">
          Loading more issues...
        </p>
      )}
    </main>
  );
}
