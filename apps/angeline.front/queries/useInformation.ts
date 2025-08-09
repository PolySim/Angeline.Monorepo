import { getBiography, updateBiography } from "@/action/information.action";
import { Information } from "@repo/types/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBiography = () => {
  return useQuery({
    queryKey: ["biography"],
    queryFn: getBiography,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateBiography = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBiography,
    onMutate: (biography) => {
      queryClient.cancelQueries({ queryKey: ["biography"] });
      const previousBiography = queryClient.getQueryData(["biography"]);
      queryClient.setQueryData(["biography"], (old: Information[]) =>
        old.map((item) => (item.lang === biography.lang ? biography : item))
      );
      return { previousBiography };
    },
    onError: (_error, _biography, context) => {
      queryClient.setQueryData(["biography"], context?.previousBiography);
      toast.error(
        "Une erreur est survenue lors de la mise à jour de la biographie"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },
  });
};
