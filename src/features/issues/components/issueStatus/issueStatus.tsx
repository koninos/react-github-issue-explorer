import type { Issue } from "../../api";
import styles from "./issueStatus.module.css";

type IssueStatusProps = {
  state: Issue["state"];
};

export function IssueStatus({ state }: IssueStatusProps) {
  const status = state === "open" ? "issueStatus--open" : "issueStatus--closed";

  return (
    <span className={`${styles.issueStatus} ${styles[status]}`}>
      <span className={styles.issueStatus__indicator} aria-hidden="true" />
      {state}
    </span>
  );
}
