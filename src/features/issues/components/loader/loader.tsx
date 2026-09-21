import "./loader.css";

export function Loader() {
  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <span>Loading issues...</span>
    </div>
  );
}
