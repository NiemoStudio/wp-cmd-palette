import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: number;
  pinned: boolean;
  title: string;
  type: string;
  url: string;
}

export function useSearch() {
  const { data } = useQuery({
    queryFn: async () => {
      try {
        const [resultsResponse, pinnedResponse] = await Promise.all([
          fetch("/wp-json/wp-cmd-palette/v1/list", {
            body: JSON.stringify({
              currentUrl: window.location.href,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }),
          fetch("/wp-json/wp-cmd-palette/v1/pinned"),
        ]);

        if (!resultsResponse.ok || !pinnedResponse.ok) {
          throw new Error(`HTTP error status`);
        }

        const [results, pinnedPages] = await Promise.all([
          resultsResponse.json(),
          pinnedResponse.json(),
        ]);

        const pinnedIds = pinnedPages.map(
          (p: Pick<SearchResult, "id">) => p.id
        );

        return results.map((item: Omit<SearchResult, "pinned">) => ({
          ...item,
          pinned: pinnedIds.includes(item.id),
        }));
      } catch (e) {
        throw new Error(
          e instanceof Error ? e.message : "Unknown error occurred"
        );
      }
    },
    queryKey: ["search/list"],
  });

  return {
    results: data,
    search: (query: string) => {
      console.log(query);
    },
  };
}
