import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchIssues } from "../api";

export function useIssues() {
  return useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam }) => fetchIssues(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
}
