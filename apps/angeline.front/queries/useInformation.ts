import { getBiography, updateBiography } from "@/action/information.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBiography = () => {
  return useQuery({
    queryKey: ["biography"],
    queryFn: async () => {
      const biography = await getBiography();
      if (!biography) throw new Error("Impossible de charger la biographie.");
      return biography;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateBiography = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (biography: Parameters<typeof updateBiography>[0]) => {
      const response = await updateBiography(biography);
      if (!response?.success) throw new Error("Biography update failed");
      return response;
    },
    onSuccess: () => {
      toast.success("Biographie enregistrée");
    },
    onError: () => {
      toast.error(
        "Une erreur est survenue lors de la mise à jour de la biographie",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },
  });
};
