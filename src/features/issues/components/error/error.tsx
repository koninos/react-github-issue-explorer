import "./error.css";

type ErrorStateProps = {
  errorMsg: string;
};

export function Error({ errorMsg }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__title">Unable to load issues</p>
      <p className="error-state__message">{errorMsg}</p>
    </div>
  );
}
