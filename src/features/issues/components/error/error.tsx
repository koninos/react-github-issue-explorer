import styles from "./error.module.css";

type ErrorStateProps = {
  errorMsg: string;
};

export function Error({ errorMsg }: ErrorStateProps) {
  return (
    <div className={styles.errorState} role="alert">
      <p className={styles.errorState__title}>Unable to load issues</p>
      <p className={styles.errorState__message}>{errorMsg}</p>
    </div>
  );
}
