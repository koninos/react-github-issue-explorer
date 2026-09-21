import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Issue } from "../api";

type UseIssueVirtualizerParams = {
  issues: Issue[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function useIssueVirtualizer({
  issues,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseIssueVirtualizerParams) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: issues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
    onChange: (instance) => {
      const virtualItems = instance.getVirtualItems();
      const lastItem = virtualItems[virtualItems.length - 1];

      if (!lastItem) {
        return;
      }

      if (
        lastItem.index >= issues.length - 5 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
  });

  return {
    parentRef,
    rowVirtualizer,
  };
}
