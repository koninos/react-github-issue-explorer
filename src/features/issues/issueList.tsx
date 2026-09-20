import { type Issue } from "./api";
import "./issueList.css";

const mockIssues: Issue[] = [
  {
    id: 1,
    number: 12345,
    title: "Fix incorrect state update when navigating between views",
    html_url: "#",
    state: "open",
    author: "johndoe",
  },
  {
    id: 2,
    number: 12344,
    title: "Improve error handling for failed requests",
    html_url: "#",
    state: "open",
    author: "janedoe",
  },
  {
    id: 3,
    number: 12343,
    title: "Remove unnecessary re-renders in the issue list",
    html_url: "#",
    state: "closed",
    author: "developer123",
  },
];

export function IssueList() {
  return (
    <main className="issue-explorer">
      <header className="page-header">
        <h1>Issue Explorer</h1>
        <p>Browse issues from the React repository</p>
      </header>

      <ul className="issue-list">
        {mockIssues.map(({ id, html_url, title, number, state, author }) => (
          <li key={id}>
            <article className="issue-card">
              <div className="issue-card__header">
                <h2>
                  <a href={html_url}>{title}</a>
                </h2>
              </div>

              <div className="issue-card__meta">
                <span>#{number}</span>
                <span>{state}</span>
                <span>{author}</span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
