import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { mutate: resetToDefault } = useMutation({
    mutationFn: async () => {
      if (!window.wpApiSettings?.nonce) {
        throw new Error("WordPress REST API nonce is not available");
      }

      const response = await fetch("/wp-json/wp-cmd-palette/v1/reset", {
        credentials: "include",
        headers: {
          "X-WP-Nonce": window.wpApiSettings.nonce,
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onError: () => {
      toast.error("Failed to reset settings");
    },
    onSuccess: () => {
      // Invalidate all queries to refresh the UI
      queryClient.invalidateQueries();
      toast.success("Settings reset to default successfully");
    },
  });

  return {
    resetToDefault,
  };
};
