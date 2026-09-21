import type { Issue } from "../api";
import "./issueStatus.css";

type IssueStatusProps = {
  state: Issue["state"];
};

export function IssueStatus({ state }: IssueStatusProps) {
  return (
    <span className={`issue-status issue-status--${state}`}>
      <span className="issue-status__indicator" aria-hidden="true" />
      {state}
    </span>
  );
}
