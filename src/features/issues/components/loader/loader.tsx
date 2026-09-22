import styles from "./loader.module.scss";

export function Loader() {
  return (
    <div className={styles.loadingState} role="status">
      <span className={styles.loadingSpinner} aria-hidden="true" />
      <span>Loading issues...</span>
    </div>
  );
}
