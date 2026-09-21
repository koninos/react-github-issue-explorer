import { render, screen } from "@testing-library/react";
import { useIssues } from "../../hooks/useIssues";
import { IssueList } from "./issueList";

jest.mock("../../hooks/useIssues");

const mockedUseIssues = jest.mocked(useIssues);

type MockUseIssues = Partial<ReturnType<typeof useIssues>>;

describe("IssueList", () => {
  it("renders a loading state while issues are loading", () => {
    mockedUseIssues.mockReturnValue({
      isPending: true,
      isError: false,
    } as ReturnType<typeof useIssues>);

    render(<IssueList />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading issues...");
  });

  it("renders an error state when loading issues fails", () => {
    mockedUseIssues.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error("Failed to fetch issues"),
    } as ReturnType<typeof useIssues>);

    render(<IssueList />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load issues",
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to fetch issues",
    );
  });

  it("renders an empty state when there are no issues", () => {
    mockedUseIssues.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        pages: [[]],
        pageParams: [1],
      },
    } as MockUseIssues as ReturnType<typeof useIssues>);

    render(<IssueList />);

    expect(screen.getByRole("status")).toHaveTextContent("No issues found");
  });
});
