import "./emptyState.css";

export function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">No issues found</p>
      <p className="empty-state__message">There are no issues to display.</p>
    </div>
  );
}
