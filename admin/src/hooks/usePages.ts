import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Page, ColorKey } from "@/types";
import { IconName } from "@/lib/icons";
import { toast } from "sonner";

export function usePages() {
  const queryClient = useQueryClient();
  const [pages, setPages] = useState<Page[]>([]);
  const [pinnedPages, setPinnedPages] = useState<Page[]>([]);

  const { data: pagesData, isLoading: isLoadingPages } = useQuery({
    queryFn: async () => {
      if (!window.wpApiSettings?.nonce) {
        throw new Error("WordPress REST API nonce is not available");
      }

      const response = await fetch("/wp-json/wp-cmd-palette/v1/list", {
        body: JSON.stringify({ currentUrl: window.location.href }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.wpApiSettings.nonce,
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    queryKey: ["pages"],
  });

  const { data: pinnedPagesData, isLoading: isLoadingPinnedPages } = useQuery({
    queryFn: async () => {
      const response = await fetch("/wp-json/wp-cmd-palette/v1/pinned", {
        credentials: "include",
        headers: {
          "X-WP-Nonce": window.wpApiSettings.nonce,
        },
      });
      return response.json();
    },
    queryKey: ["pinned-pages"],
  });

  useEffect(() => {
    if (pinnedPagesData) {
      setPinnedPages(pinnedPagesData);
    }
  }, [pinnedPagesData]);

  useEffect(() => {
    if (pagesData) {
      setPages(pagesData);
    }
  }, [pagesData]);

  const pinMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const response = await fetch("/wp-json/wp-cmd-palette/v1/pinned", {
        body: JSON.stringify({ pageId }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.wpApiSettings.nonce,
        },
        method: "POST",
      });
      return response.json();
    },
    onError: () => {
      toast.error("Failed to pin page");
    },
    onSuccess: () => {
      toast.success("Changes saved");
      queryClient.invalidateQueries({ queryKey: ["pinned-pages"] });
    },
  });

  const unpinMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const response = await fetch(
        `/wp-json/wp-cmd-palette/v1/pinned/${pageId}`,
        {
          credentials: "include",
          headers: {
            "X-WP-Nonce": window.wpApiSettings.nonce,
          },
          method: "DELETE",
        }
      );
      return response.json();
    },
    onError: () => {
      toast.error("Failed to unpin page");
    },
    onSuccess: () => {
      toast.success("Changes saved");
      queryClient.invalidateQueries({ queryKey: ["pinned-pages"] });
    },
  });

  const updatePageSettings = async (
    pageId: number,
    settings: Partial<Page>
  ) => {
    const response = await fetch(`/wp-json/wp-cmd-palette/v1/pages/${pageId}`, {
      body: JSON.stringify(settings),
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce,
      },
      method: "PATCH",
    });

    if (response.ok) {
      setPages(
        pages.map((page) =>
          page.id === pageId ? { ...page, ...settings } : page
        )
      );
      setPinnedPages(
        pinnedPages.map((page) =>
          page.id === pageId ? { ...page, ...settings } : page
        )
      );
      toast.success("Changes saved");
      return response.json();
    }

    toast.error("Failed to update page settings");
    throw new Error("Failed to update page settings");
  };

  const updatePageColor = (pageId: number, color: ColorKey) => {
    updatePageSettings(pageId, { color });
  };

  const updatePageIcon = (pageId: number, icon: IconName) => {
    updatePageSettings(pageId, { icon });
  };

  const togglePageVisibility = (pageId: number) => {
    const page = pages.find((p) => p.id === pageId);
    updatePageSettings(pageId, { hidden: !page?.hidden }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["pinned-pages"] });
    });
  };

  const reorderPages = async (activeId: number, overId: number) => {
    const oldIndex = pinnedPages.findIndex((p) => p.id === activeId);
    const newIndex = pinnedPages.findIndex((p) => p.id === overId);

    const newPinnedPages = [...pinnedPages];
    const [movedItem] = newPinnedPages.splice(oldIndex, 1);
    newPinnedPages.splice(newIndex, 0, movedItem);

    try {
      // Update order for all pinned pages
      await Promise.all(
        newPinnedPages.map((page, index) =>
          fetch(`/wp-json/wp-cmd-palette/v1/pages/${page.id}`, {
            body: JSON.stringify({
              order: index * 10, // Use multiples of 10 for pinned pages starting at 0
              pinned: true, // Add a pinned flag to ensure proper ordering in the command palette
            }),
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": window.wpApiSettings.nonce,
            },
            method: "PATCH",
          })
        )
      );

      // Only invalidate queries after successful update
      queryClient.invalidateQueries({ queryKey: ["pinned-pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page order updated");
    } catch (error) {
      console.error("Failed to update pinned page order:", error);
      toast.error("Failed to update pinned page order");
    }
  };

  const reorderUnpinnedPages = async (activeId: number, overId: number) => {
    const unpinnedPages = pages.filter(
      (page) => !pinnedPages.some((pinned) => pinned.id === page.id)
    );

    const oldIndex = unpinnedPages.findIndex((p) => p.id === activeId);
    const newIndex = unpinnedPages.findIndex((p) => p.id === overId);

    const newUnpinnedPages = [...unpinnedPages];
    const [movedItem] = newUnpinnedPages.splice(oldIndex, 1);
    newUnpinnedPages.splice(newIndex, 0, movedItem);

    try {
      // Start unpinned pages order after pinned pages
      const startOrder = 1000; // Use a large offset to clearly separate pinned and unpinned pages

      // Update order for all affected pages
      await Promise.all(
        newUnpinnedPages.map((page, index) =>
          fetch(`/wp-json/wp-cmd-palette/v1/pages/${page.id}`, {
            body: JSON.stringify({
              order: startOrder + index * 10,
              pinned: false, // Add a pinned flag to ensure proper ordering in the command palette
            }),
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": window.wpApiSettings.nonce,
            },
            method: "PATCH",
          })
        )
      );

      // Only invalidate queries after successful update
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page order updated");
    } catch (error) {
      console.error("Failed to update page order:", error);
      toast.error("Failed to update page order");
    }
  };

  return {
    isLoading: isLoadingPages || isLoadingPinnedPages,
    isPinning: pinMutation.isPending,
    isUnpinning: unpinMutation.isPending,
    pages,
    pinnedPages,
    pinPage: pinMutation.mutate,
    reorderPages,
    reorderUnpinnedPages,
    togglePageVisibility,
    unpinPage: unpinMutation.mutate,
    updatePageColor,
    updatePageIcon,
  };
}
