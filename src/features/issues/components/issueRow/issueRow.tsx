import type { VirtualItem } from "@tanstack/react-virtual";
import type { Issue } from "../../api";
import { IssueStatus } from "../issueStatus/issueStatus";
import styles from "./issueRow.module.css";

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
      className={styles.issueRow}
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      <article className={styles.issueCard}>
        <div className={styles.issueCard__header}>
          <h2>
            <a href={html_url}>{title}</a>
          </h2>
        </div>

        <div className={styles.issueCard__meta}>
          <span>#{number}</span>

          <IssueStatus state={state} />

          <span>{author}</span>
        </div>
      </article>
    </li>
  );
}
