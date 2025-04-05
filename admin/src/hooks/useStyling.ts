import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StylingSettings } from "@/types";

export const useStyling = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryFn: async () => {
      if (!window.wpApiSettings?.nonce) {
        throw new Error("WordPress REST API nonce is not available");
      }

      const response = await fetch("/wp-json/wp-cmd-palette/v1/styling", {
        credentials: "include",
        headers: {
          "X-WP-Nonce": window.wpApiSettings.nonce,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<StylingSettings>;
    },
    queryKey: ["styling"],
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: StylingSettings) => {
      if (!window.wpApiSettings?.nonce) {
        throw new Error("WordPress REST API nonce is not available");
      }

      const response = await fetch("/wp-json/wp-cmd-palette/v1/styling", {
        body: JSON.stringify(newSettings),
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

      return response.json() as Promise<StylingSettings>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styling"] });
    },
  });

  return {
    isLoading,
    settings,
    updateSettings,
  };
};
