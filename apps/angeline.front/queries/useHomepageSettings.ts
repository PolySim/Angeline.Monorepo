import {
  getHomepageSettings,
  updateHomepageSettings,
} from "@/action/homepageSettings.action";
import { UpdateHomepageSettingsDto } from "@repo/types/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useHomepageSettings = () => {
  return useQuery({
    queryKey: ["homepage-settings"],
    queryFn: async () => {
      const settings = await getHomepageSettings();
      if (!settings) throw new Error("Impossible de charger les réglages.");
      return settings;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateHomepageSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: UpdateHomepageSettingsDto) =>
      updateHomepageSettings(settings),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Page d’accueil mise à jour");
      } else {
        toast.error("La page d’accueil n’a pas pu être mise à jour");
      }
    },
    onError: () => {
      toast.error("La page d’accueil n’a pas pu être mise à jour");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-settings"] });
    },
  });
};
