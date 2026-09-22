import styles from "./emptyState.module.scss";

export function EmptyState() {
  return (
    <div className={styles.emptyState} role="status">
      <p className={styles.emptyState__title}>No issues found</p>
      <p className={styles.emptyState__message}>
        There are no issues to display.
      </p>
    </div>
  );
}
