import type { VirtualItem } from "@tanstack/react-virtual";
import type { Issue } from "../../api";
import { IssueStatus } from "../issueStatus/issueStatus";
import "./issueRow.css";

type IssueRowProps = {
  issue: Issue;
  virtualRow: VirtualItem;
  measureElement: (element: Element | null) => void;
};

export function IssueRow({ issue, virtualRow, measureElement }: IssueRowProps) {
  const { html_url, title, number, state, author } = issue;

  return (
    <li
      ref={measureElement}
      data-index={virtualRow.index}
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

          <IssueStatus state={state} />

          <span>{author}</span>
        </div>
      </article>
    </li>
  );
}
